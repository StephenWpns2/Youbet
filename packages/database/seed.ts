import { PrismaClient, EventStatus, PickType, PickStatus, ProofType, ReactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data (in development)
  await prisma.report.deleteMany();
  await prisma.tip.deleteMany();
  await prisma.attribution.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.pick.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const mike = await prisma.user.create({
    data: {
      clerkId: "clerk_mike_123",
      handle: "mikej_bets",
      email: "mike@youbet.com",
      name: "Mike Johnson",
      bio: "🏀 NBA Expert | 📊 Data-driven picks | 🎯 5-year track record",
      avatarUrl: "/sports-bettor.jpg",
      ageVerified: true,
      geoRegion: "US-NY",
      totalPicks: 247,
      totalWins: 168,
      totalLosses: 79,
      totalProfit: 2340.50,
      roi30d: 23.5,
      roiLifetime: 23.5,
      winRate30d: 68.0,
      winRateLifetime: 68.0,
    },
  });

  const sarah = await prisma.user.create({
    data: {
      clerkId: "clerk_sarah_456",
      handle: "sarahc",
      email: "sarah@youbet.com",
      name: "Sarah Chen",
      bio: "⚽ Soccer specialist | 🇪🇸 La Liga & Premier League | 📈 ROI focused",
      avatarUrl: "/female-sports-fan.jpg",
      ageVerified: true,
      geoRegion: "US-CA",
      totalPicks: 203,
      totalWins: 138,
      totalLosses: 65,
      totalProfit: 1890.00,
      roi30d: 18.2,
      roiLifetime: 18.2,
      winRate30d: 68.0,
      winRateLifetime: 68.0,
    },
  });

  const alex = await prisma.user.create({
    data: {
      clerkId: "clerk_alex_789",
      handle: "alexr",
      email: "alex@youbet.com",
      name: "Alex Rivera",
      bio: "🏈 NFL grinder | 🎲 Value hunter | 💪 Long-term profit",
      avatarUrl: "/sports-enthusiast.png",
      ageVerified: true,
      geoRegion: "US-TX",
      totalPicks: 180,
      totalWins: 126,
      totalLosses: 54,
      totalProfit: 3200.00,
      roi30d: 31.8,
      roiLifetime: 31.8,
      winRate30d: 70.0,
      winRateLifetime: 70.0,
    },
  });

  console.log("✅ Created 3 users");

  // Create Follows
  await prisma.follow.createMany({
    data: [
      { followerId: mike.id, followeeId: sarah.id },
      { followerId: mike.id, followeeId: alex.id },
      { followerId: sarah.id, followeeId: mike.id },
      { followerId: sarah.id, followeeId: alex.id },
      { followerId: alex.id, followeeId: mike.id },
    ],
  });

  console.log("✅ Created follow relationships");

  // Create Events
  const lakersWarriors = await prisma.event.create({
    data: {
      providerId: "nba_lal_gsw_20251103",
      sport: "NBA",
      league: "NBA Regular Season",
      homeTeam: "Los Angeles Lakers",
      awayTeam: "Golden State Warriors",
      startTime: new Date("2025-11-03T22:30:00Z"),
      status: EventStatus.FINISHED,
      homeScore: 112,
      awayScore: 108,
      winner: "home",
      settledAt: new Date("2025-11-04T01:15:00Z"),
    },
  });

  const manCityArsenal = await prisma.event.create({
    data: {
      providerId: "epl_mci_ars_20251103",
      sport: "Soccer",
      league: "Premier League",
      homeTeam: "Manchester City",
      awayTeam: "Arsenal",
      startTime: new Date("2025-11-03T20:00:00Z"),
      status: EventStatus.FINISHED,
      homeScore: 2,
      awayScore: 2,
      winner: "draw",
      settledAt: new Date("2025-11-03T21:55:00Z"),
    },
  });

  const chiefsBills = await prisma.event.create({
    data: {
      providerId: "nfl_kc_buf_20251103",
      sport: "NFL",
      league: "NFL Regular Season",
      homeTeam: "Kansas City Chiefs",
      awayTeam: "Buffalo Bills",
      startTime: new Date("2025-11-03T18:00:00Z"),
      status: EventStatus.SCHEDULED,
    },
  });

  console.log("✅ Created 3 events");

  // Create Picks
  const mikePick1 = await prisma.pick.create({
    data: {
      userId: mike.id,
      eventId: lakersWarriors.id,
      market: "Moneyline",
      selection: "Lakers ML",
      oddsDecimal: 2.50,
      stake: 100.00,
      book: "DraftKings",
      type: PickType.RESULT,
      proofType: ProofType.IMAGE,
      proofUrl: "slips/mike_lakers_20251103.jpg",
      proofHash: "abc123def456",
      status: PickStatus.WIN,
      profit: 150.00,
      lockedAt: new Date("2025-11-03T22:30:00Z"),
      settledAt: new Date("2025-11-04T01:15:00Z"),
      createdAt: new Date("2025-11-03T18:00:00Z"),
    },
  });

  const sarahPick1 = await prisma.pick.create({
    data: {
      userId: sarah.id,
      eventId: manCityArsenal.id,
      market: "Over/Under",
      selection: "Over 2.5 goals",
      oddsDecimal: 2.00,
      stake: 50.00,
      book: "FanDuel",
      type: PickType.RESULT,
      proofType: ProofType.LINK,
      proofUrl: "https://fanduel.com/slip/xyz",
      status: PickStatus.LOSS,
      profit: -50.00,
      lockedAt: new Date("2025-11-03T20:00:00Z"),
      settledAt: new Date("2025-11-03T21:55:00Z"),
      createdAt: new Date("2025-11-03T15:00:00Z"),
    },
  });

  const alexPick1 = await prisma.pick.create({
    data: {
      userId: alex.id,
      eventId: chiefsBills.id,
      market: "Spread",
      selection: "Chiefs -3.5",
      oddsDecimal: 1.91,
      stake: 200.00,
      book: "BetMGM",
      type: PickType.PREDICTION,
      proofType: ProofType.IMAGE,
      proofUrl: "slips/alex_chiefs_20251103.jpg",
      status: PickStatus.PENDING,
      createdAt: new Date("2025-11-03T12:00:00Z"),
    },
  });

  console.log("✅ Created 3 picks");

  // Create Reactions
  await prisma.reaction.createMany({
    data: [
      { userId: sarah.id, pickId: mikePick1.id, type: ReactionType.FIRE },
      { userId: alex.id, pickId: mikePick1.id, type: ReactionType.CELEBRATE },
      { userId: mike.id, pickId: sarahPick1.id, type: ReactionType.THINKING },
      { userId: mike.id, pickId: alexPick1.id, type: ReactionType.LIKE },
      { userId: sarah.id, pickId: alexPick1.id, type: ReactionType.LIKE },
    ],
  });

  console.log("✅ Created reactions");

  // Create Comments
  await prisma.comment.createMany({
    data: [
      {
        userId: sarah.id,
        pickId: mikePick1.id,
        text: "Great call! Lakers looked dominant tonight 🔥",
      },
      {
        userId: alex.id,
        pickId: mikePick1.id,
        text: "I tailed this one, thanks for the winner! 💰",
      },
      {
        userId: mike.id,
        pickId: sarahPick1.id,
        text: "Tough beat on the push, both teams played defensive",
      },
      {
        userId: mike.id,
        pickId: alexPick1.id,
        text: "Chiefs have been covering lately, I like this pick",
      },
    ],
  });

  console.log("✅ Created comments");

  // Create Attributions
  await prisma.attribution.createMany({
    data: [
      {
        pickId: mikePick1.id,
        partner: "draftkings",
        clickId: "dk_click_123",
        revenue: 15.00,
      },
      {
        pickId: sarahPick1.id,
        partner: "fanduel",
        clickId: "fd_click_456",
        revenue: 5.00,
      },
    ],
  });

  console.log("✅ Created attributions");

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

