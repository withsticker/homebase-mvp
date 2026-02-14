import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  // Get first user from auth
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError || !users?.length) {
    console.error("No users found. Sign up first, then run seed.", usersError);
    process.exit(1);
  }

  const userId = users[0].id;
  console.log(`Seeding data for user: ${userId}`);

  // Contacts
  const contacts = [
    { user_id: userId, full_name: "Ahmed Khan", email: "ahmed@realty.com", phone: "+92-300-1234567", company: "Khan Realty", status: "qualified", source: "referral" },
    { user_id: userId, full_name: "Sara Malik", email: "sara@homes.pk", phone: "+92-321-9876543", company: "Malik Homes", status: "new", source: "website" },
    { user_id: userId, full_name: "John Smith", email: "john@example.com", phone: "+1-555-0101", company: "Smith Corp", status: "won", source: "cold_call" },
    { user_id: userId, full_name: "Emily Chen", email: "emily@invest.co", phone: "+1-555-0202", company: "Chen Investments", status: "negotiation", source: "referral" },
    { user_id: userId, full_name: "Omar Farooq", email: "omar@build.pk", phone: "+92-333-4445556", company: "Farooq Builders", status: "contacted", source: "website" },
    { user_id: userId, full_name: "Lisa Park", email: "lisa@homes.com", phone: "+1-555-0303", company: "Park Living", status: "lost", source: "social_media" },
    { user_id: userId, full_name: "David Brown", email: "david@prop.co", phone: "+1-555-0404", company: "Brown Properties", status: "new", source: "referral" },
    { user_id: userId, full_name: "Fatima Zahra", email: "fatima@estate.pk", phone: "+92-345-6667778", company: "Zahra Estate", status: "qualified", source: "website" },
  ];

  const { error: cErr } = await supabase.from("contacts").upsert(contacts, { onConflict: "id" });
  if (cErr) console.error("Contacts error:", cErr.message);
  else console.log(`✓ ${contacts.length} contacts inserted`);

  // Get inserted contact IDs
  const { data: insertedContacts } = await supabase.from("contacts").select("id").eq("user_id", userId).limit(8);
  const contactIds = insertedContacts?.map((c) => c.id) ?? [];

  // Properties
  const properties = [
    { user_id: userId, title: "Luxury Villa DHA Phase 6", address: "Street 12, DHA Phase 6, Lahore", property_type: "residential" as const, status: "available" as const, price: 45000000, bedrooms: 5, bathrooms: 4, area_sqft: 4500, contact_id: contactIds[0] ?? null },
    { user_id: userId, title: "Commercial Plaza Gulberg", address: "Main Boulevard, Gulberg III, Lahore", property_type: "commercial" as const, status: "under_contract" as const, price: 120000000, bedrooms: null, bathrooms: 4, area_sqft: 12000, contact_id: contactIds[1] ?? null },
    { user_id: userId, title: "3-Bed Apartment Bahria Town", address: "Sector C, Bahria Town, Lahore", property_type: "residential" as const, status: "available" as const, price: 15000000, bedrooms: 3, bathrooms: 2, area_sqft: 1800, contact_id: contactIds[3] ?? null },
    { user_id: userId, title: "Rental Flat Johar Town", address: "Block G1, Johar Town, Lahore", property_type: "rental" as const, status: "rented" as const, price: 75000, bedrooms: 2, bathrooms: 1, area_sqft: 1100, contact_id: contactIds[4] ?? null },
    { user_id: userId, title: "Farmhouse Bedian Road", address: "Bedian Road, Lahore", property_type: "residential" as const, status: "available" as const, price: 85000000, bedrooms: 7, bathrooms: 6, area_sqft: 10000, contact_id: null },
    { user_id: userId, title: "Shop DHA Phase 5", address: "Commercial Area, DHA Phase 5", property_type: "commercial" as const, status: "sold" as const, price: 25000000, bedrooms: null, bathrooms: 1, area_sqft: 800, contact_id: contactIds[2] ?? null },
  ];

  const { error: pErr } = await supabase.from("properties").upsert(properties, { onConflict: "id" });
  if (pErr) console.error("Properties error:", pErr.message);
  else console.log(`✓ ${properties.length} properties inserted`);

  // Tasks
  const tasks = [
    { user_id: userId, title: "Follow up with Ahmed Khan", description: "Discuss DHA villa pricing", due_date: new Date(Date.now() + 86400000).toISOString(), priority: "high" as const, status: "pending" as const, contact_id: contactIds[0] ?? null },
    { user_id: userId, title: "Schedule site visit - Bahria Town", description: "Emily wants to see the apartment", due_date: new Date(Date.now() + 172800000).toISOString(), priority: "medium" as const, status: "in_progress" as const, contact_id: contactIds[3] ?? null },
    { user_id: userId, title: "Prepare rental agreement", description: "Johar Town flat lease docs", due_date: new Date(Date.now() + 259200000).toISOString(), priority: "low" as const, status: "pending" as const },
    { user_id: userId, title: "Call David Brown", description: "New lead - interested in residential", due_date: new Date(Date.now() - 86400000).toISOString(), priority: "high" as const, status: "pending" as const, contact_id: contactIds[6] ?? null },
    { user_id: userId, title: "Update property photos", description: "Get new photos for DHA listings", due_date: new Date(Date.now() + 432000000).toISOString(), priority: "medium" as const, status: "pending" as const },
    { user_id: userId, title: "Close Gulberg Plaza deal", description: "Final negotiation with Sara", due_date: new Date(Date.now() + 86400000).toISOString(), priority: "high" as const, status: "in_progress" as const, contact_id: contactIds[1] ?? null },
  ];

  const { error: tErr } = await supabase.from("tasks").upsert(tasks, { onConflict: "id" });
  if (tErr) console.error("Tasks error:", tErr.message);
  else console.log(`✓ ${tasks.length} tasks inserted`);

  // Activities
  const activities = [
    { user_id: userId, action: "created", entity_type: "contact", metadata: { name: "Ahmed Khan" } },
    { user_id: userId, action: "updated", entity_type: "property", metadata: { title: "Luxury Villa DHA Phase 6" } },
    { user_id: userId, action: "created", entity_type: "task", metadata: { title: "Follow up with Ahmed Khan" } },
    { user_id: userId, action: "status_changed", entity_type: "contact", metadata: { name: "John Smith", from: "negotiation", to: "won" } },
    { user_id: userId, action: "created", entity_type: "property", metadata: { title: "Farmhouse Bedian Road" } },
  ];

  const { error: aErr } = await supabase.from("activities").upsert(activities, { onConflict: "id" });
  if (aErr) console.error("Activities error:", aErr.message);
  else console.log(`✓ ${activities.length} activities inserted`);

  console.log("\n🎉 Seed complete!");
}

seed().catch(console.error);
