import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No stripe signature found");

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    logStep("Processing event", { type: event.type, id: event.id });

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription, supabaseClient);
        break;
      
      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription, supabaseClient);
        break;
      
      case "invoice.payment_succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.Invoice, supabaseClient);
        break;
      
      case "invoice.payment_failed":
        await handlePaymentFailure(event.data.object as Stripe.Invoice, supabaseClient);
        break;
      
      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleSubscriptionChange(subscription: Stripe.Subscription, supabaseClient: any) {
  logStep("Handling subscription change", { 
    subscriptionId: subscription.id, 
    customerId: subscription.customer,
    status: subscription.status 
  });

  const customer = await subscription.customer as Stripe.Customer;
  const email = customer.email;
  
  if (!email) {
    logStep("No email found for customer", { customerId: subscription.customer });
    return;
  }

  // Find user by email
  const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
  if (userError) {
    logStep("Error fetching users", { error: userError.message });
    return;
  }

  const user = users.users.find((u: any) => u.email === email);
  if (!user) {
    logStep("User not found", { email });
    return;
  }

  const isActive = subscription.status === "active";
  const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
  const subscriptionStart = new Date(subscription.current_period_start * 1000).toISOString();

  // Determine subscription tier
  const priceId = subscription.items.data[0].price.id;
  const price = await subscription.items.data[0].price;
  const amount = price.unit_amount || 0;
  const subscriptionTier = amount <= 1490 ? "VIP" : "VIP Premium";

  // Update user VIP status
  await supabaseClient.rpc('update_user_vip_status', {
    user_id: user.id,
    is_vip: isActive,
    subscription_start: subscriptionStart,
    subscription_end: subscriptionEnd,
    subscription_tier: subscriptionTier
  });

  logStep("Updated user VIP status", { 
    userId: user.id, 
    email, 
    is_vip: isActive,
    subscription_tier: subscriptionTier,
    subscription_end: subscriptionEnd
  });
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription, supabaseClient: any) {
  logStep("Handling subscription cancellation", { 
    subscriptionId: subscription.id, 
    customerId: subscription.customer 
  });

  const customer = await subscription.customer as Stripe.Customer;
  const email = customer.email;
  
  if (!email) return;

  // Find user by email
  const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
  if (userError) return;

  const user = users.users.find((u: any) => u.email === email);
  if (!user) return;

  // Remove VIP status
  await supabaseClient.rpc('update_user_vip_status', {
    user_id: user.id,
    is_vip: false,
    subscription_start: null,
    subscription_end: null,
    subscription_tier: null
  });

  logStep("Removed VIP status", { userId: user.id, email });
}

async function handlePaymentSuccess(invoice: Stripe.Invoice, supabaseClient: any) {
  logStep("Handling payment success", { invoiceId: invoice.id });
  // Payment success is handled by subscription events
}

async function handlePaymentFailure(invoice: Stripe.Invoice, supabaseClient: any) {
  logStep("Handling payment failure", { invoiceId: invoice.id });
  // Could implement grace period logic here
}
