const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Rouniyar Decor...');

  // Clean existing data
  await prisma.couponUsage.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned existing records.');

  // 1. Create Users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const customerPassword = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Rouniyar Decor Admin',
      email: 'admin@rouniyardecor.com',
      password: adminPassword,
      phone: '+91 98765 43210',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      password: customerPassword,
      phone: '+91 98111 22334',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      password: customerPassword,
      phone: '+91 98222 33445',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Priya Sundaram',
      email: 'priya@example.com',
      password: customerPassword,
      phone: '+91 98333 44556',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log('👤 Created Admin and 3 Customer accounts.');

  // Create Addresses
  const address1 = await prisma.address.create({
    data: {
      userId: user1.id,
      name: 'Ananya Sharma',
      mobile: '+91 98111 22334',
      houseFlat: 'Flat 402, Lotus Towers',
      street: 'Koramangala 4th Block',
      area: 'Near Sony World Junction',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      landmark: 'Opposite Cafe Coffee Day',
      isDefault: true,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: user2.id,
      name: 'Rahul Verma',
      mobile: '+91 98222 33445',
      houseFlat: 'B-12, Green Glen Layout',
      street: 'Bellandur Main Road',
      area: 'Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      landmark: 'Near EcoSpace Tech Park',
      isDefault: true,
    },
  });

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Toran & Bandarwal',
      slug: 'toran-bandarwal',
      description: 'Handcrafted crochet and woolen door torans adorned with floral motifs, pom-pom gondas, and auspicious hangings.',
      image: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=80',
      order: 1,
    },
    {
      name: 'Door Hangings & Latkans',
      slug: 'door-hangings',
      description: 'Traditional handcrafted door side hangings, latkans, bells, and auspicious symbols for home entrances.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
      order: 2,
    },
    {
      name: 'Pooja Decor & Thali Posh',
      slug: 'pooja-decor-thali-posh',
      description: 'Intricately knit 16" crochet thali posh, velvet lotus covers, and sacred accessories for your home mandir.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      order: 3,
    },
    {
      name: 'Wall Decor & Jharokhas',
      slug: 'wall-decor',
      description: 'Artisanal woolen mandala hangings, mirror work jharokhas, and handcrafted macrame wall accents.',
      image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=600&auto=format&fit=crop&q=80',
      order: 4,
    },
    {
      name: 'Festive Decor Specials',
      slug: 'festive-decor',
      description: 'Vibrant marigold & pom-pom garland sets, Diwali entrance bandarwals, and festive celebration decor.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
      order: 5,
    },
    {
      name: 'Handmade Handicrafts',
      slug: 'handmade-handicrafts',
      description: 'One-of-a-kind handcrafted heritage pieces crafted with care by traditional Indian artisans.',
      image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600&auto=format&fit=crop&q=80',
      order: 6,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.create({ data: cat });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log('📁 Created 6 product categories.');

  // 3. Create Products (22 authentic Rouniyar Decor products)
  const productsData = [
    {
      name: 'Handmade Crochet Door Toran with Brown Pom Pom Gonda',
      slug: 'handmade-crochet-door-toran-brown-pom-pom-gonda',
      description: 'This signature Rouniyar Decor Door Toran is exquisitely hand-knitted using ultra-soft, premium quality woolen yarn. Featuring an intricate white, sage green, and earthy brown floral knit pattern accented by rich pom-pom gondas and wooden accent beads. Designed to infuse natural warmth and traditional Indian auspiciousness into your main entrance or pooja room. Washable, long-lasting, and meticulously woven by skilled artisans.',
      shortDescription: 'Signature handmade crochet door toran with white, sage green & brown floral motifs and soft pom-pom gondas.',
      categorySlug: 'toran-bandarwal',
      sku: 'RD-TOR-001',
      price: 499,
      mrp: 899,
      discount: 44,
      stock: 18,
      lowStockThreshold: 4,
      images: [
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      colors: ['White & Earth Brown', 'Turmeric Yellow & Green', 'Maroon & Cream'],
      material: '100% Premium Soft Wool Yarn & Wooden Beads',
      dimensions: '38 x 8.5 Inches (Standard Door Size)',
      weight: '260 Grams',
      careInstructions: 'Gentle hand wash in cold water with mild detergent. Do not wring. Dry flat in shade.',
      tags: ['Toran', 'Crochet', 'Handmade', 'Door Hanging', 'Entrance Decor', 'Diwali'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      rating: 4.9,
      reviewCount: 38,
      variants: [
        { name: 'Standard 38" (Single Door)', sku: 'RD-TOR-001-38', price: 499, mrp: 899, stock: 12, size: '38 inches', color: 'White & Earth Brown' },
        { name: 'Large 42" (Main Gate)', sku: 'RD-TOR-001-42', price: 599, mrp: 999, stock: 6, size: '42 inches', color: 'White & Earth Brown' },
      ],
    },
    {
      name: 'Royal Red & Golden Yellow Floral Bandarwal Toran',
      slug: 'royal-red-golden-yellow-floral-bandarwal-toran',
      description: 'Enrich your home entrance with this vibrant auspicious Toran. Hand-crafted with rich vermillion red and golden yellow woolen florets interspersed with faux pearl beads and brass bell drops that chime gently in the breeze. Ideal for Navratri, Diwali, Griha Pravesh, and everyday festive joy.',
      shortDescription: 'Festive red and gold woolen floral door hanging with gentle brass bell accents and pearl beads.',
      categorySlug: 'toran-bandarwal',
      sku: 'RD-TOR-002',
      price: 549,
      mrp: 949,
      discount: 42,
      stock: 14,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      colors: ['Vermillion Red & Gold', 'Maroon & Yellow'],
      material: 'Soft Acrylic Wool Yarn & Metallic Brass Bells',
      dimensions: '39 x 9 Inches',
      weight: '290 Grams',
      careInstructions: 'Spot clean with a clean damp cloth. Store wrapped in cotton cloth.',
      tags: ['Festive Toran', 'Bandarwal', 'Red Gold', 'Pooja Room', 'Diwali Decor'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      rating: 4.8,
      reviewCount: 24,
      variants: [
        { name: 'Standard 39"', sku: 'RD-TOR-002-39', price: 549, mrp: 949, stock: 14, size: '39 inches', color: 'Vermillion Red & Gold' },
      ],
    },
    {
      name: '16-Inch Hand-Knitted Crochet Thali Posh (Yellow & Red)',
      slug: '16-inch-hand-knitted-crochet-thali-posh-yellow-red',
      description: 'Elevate your pooja rituals and festive celebrations with this authentic 16-inch Rouniyar Decor Crochet Thali Posh. Lovingly knitted in a radiant radial sunburst motif featuring sacred turmeric yellow, festive red, and snowy white yarn finished with a delicate scalloped edge and tiny pom-pom tassels. Covers standard pooja and aarti thalis gracefully.',
      shortDescription: '16-inch handmade crochet cover for pooja thalis in auspicious turmeric yellow and festive red.',
      categorySlug: 'pooja-decor-thali-posh',
      sku: 'RD-THP-001',
      price: 349,
      mrp: 649,
      discount: 46,
      stock: 22,
      lowStockThreshold: 5,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      colors: ['Turmeric Yellow & Red', 'Peacock Blue & White', 'Pink & Gold'],
      material: '100% Breathable Fine Cotton & Wool Yarn',
      dimensions: '16 Inches Diameter',
      weight: '140 Grams',
      careInstructions: 'Hand wash gently in cold water. Iron on lowest silk/wool heat if required.',
      tags: ['Thali Posh', 'Pooja Cover', 'Aarti Thali', 'Crochet', 'Festive Pooja'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      rating: 4.9,
      reviewCount: 42,
      variants: [
        { name: '16-Inch Medium', sku: 'RD-THP-001-16', price: 349, mrp: 649, stock: 15, size: '16 inches', color: 'Turmeric Yellow & Red' },
        { name: '18-Inch Large', sku: 'RD-THP-001-18', price: 429, mrp: 749, stock: 7, size: '18 inches', color: 'Turmeric Yellow & Red' },
      ],
    },
    {
      name: 'Royal Maroon Velvet & Woolen Lotus Pooja Thali Posh',
      slug: 'royal-maroon-velvet-woolen-lotus-pooja-thali-posh',
      description: 'Crafted with royal maroon velvet central fabric surrounded by eight dimensional hand-crocheted lotus petals. Embellished with delicate golden gota patti border and pearl beaded drops. Creates a breathtaking spiritual presentation for your daily worship, Karwa Chauth, or Diwali aarti.',
      shortDescription: 'Regal maroon velvet thali posh bordered with handcrafted crochet lotus petals and golden gota.',
      categorySlug: 'pooja-decor-thali-posh',
      sku: 'RD-THP-002',
      price: 399,
      mrp: 699,
      discount: 43,
      stock: 16,
      lowStockThreshold: 4,
      images: [
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      colors: ['Royal Maroon & Gold', 'Emerald Green & Gold'],
      material: 'Micro Velvet & Crochet Yarn with Gota Patti',
      dimensions: '16.5 Inches Diameter',
      weight: '165 Grams',
      careInstructions: 'Dry clean recommended or gentle spot cleaning with soft fabric brush.',
      tags: ['Thali Posh', 'Lotus', 'Velvet', 'Karwa Chauth', 'Mandir Decor'],
      featured: false,
      bestSeller: true,
      newArrival: true,
      rating: 4.9,
      reviewCount: 19,
      variants: [
        { name: 'Standard 16.5"', sku: 'RD-THP-002-16', price: 399, mrp: 699, stock: 16, size: '16.5 inches', color: 'Royal Maroon & Gold' },
      ],
    },
    {
      name: 'Shubh Labh Handcrafted Door Side Hanging Pair',
      slug: 'shubh-labh-handcrafted-door-side-hanging-pair',
      description: 'Invite good fortune and prosperity into your sanctuary with this pair of traditional Shubh-Labh door side latkans. Hand-embroidered with auspicious Devanagari lettering upon sturdy woolen base rings, finished with cascading multicolored pom-poms and genuine resonant brass ghungroos.',
      shortDescription: 'Pair of handcrafted Shubh-Labh entrance side hangings with brass ghungroo bells and wool pom-poms.',
      categorySlug: 'door-hangings',
      sku: 'RD-DOR-001',
      price: 379,
      mrp: 649,
      discount: 42,
      stock: 25,
      lowStockThreshold: 5,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      colors: ['Auspicious Red & Yellow', 'Earthy Terracotta & Cream'],
      material: 'Woolen Felt, Brass Bells & Cotton Threads',
      dimensions: '24 Inches Length (Pair of 2)',
      weight: '180 Grams (Pair)',
      careInstructions: 'Wipe dust with a dry soft cloth. Avoid direct water immersion.',
      tags: ['Shubh Labh', 'Door Hanging', 'Latkan', 'Side Hanging', 'Entrance'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      rating: 4.8,
      reviewCount: 15,
      variants: [
        { name: 'Standard Pair (24")', sku: 'RD-DOR-001-24', price: 379, mrp: 649, stock: 25, size: '24 inches', color: 'Auspicious Red & Yellow' },
      ],
    },
    {
      name: 'Artisan Woolen Brass Bell & Pearl Door Latkan (Set of 2)',
      slug: 'artisan-woolen-brass-bell-pearl-door-latkan-set-of-2',
      description: 'Graceful vertical hanging accents for door corners, curtains, or pooja altar frames. Features handcrafted woolen beads alternating with luminous pearl spacers, culminating in antique-finished brass temple bells.',
      shortDescription: 'Set of 2 handcrafted woolen bead and brass temple bell door latkans with pearl accents.',
      categorySlug: 'door-hangings',
      sku: 'RD-DOR-002',
      price: 429,
      mrp: 799,
      discount: 46,
      stock: 19,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      colors: ['Antique Gold & Crimson', 'Mustard & Forest Green'],
      material: 'Hand-cast Brass Bells, Woolen Spheres, Faux Pearls',
      dimensions: '30 Inches Length Each',
      weight: '220 Grams',
      careInstructions: 'Dust with soft micro-fiber cloth.',
      tags: ['Brass Bell', 'Door Latkan', 'Temple Decor', 'Set of 2', 'Auspicious'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      rating: 4.9,
      reviewCount: 29,
      variants: [
        { name: '30" Pair', sku: 'RD-DOR-002-30', price: 429, mrp: 799, stock: 19, size: '30 inches', color: 'Antique Gold & Crimson' },
      ],
    },
    {
      name: 'Peacock Feather & Crochet Tassel Door Accent Latkan',
      slug: 'peacock-feather-crochet-tassel-door-accent-latkan',
      description: 'Inspired by Lord Krishna’s iconic peacock feather. Hand-crocheted using peacock blue, emerald green, and golden zari threads, accented with subtle mirrors that reflect warm ambient light. A mesmerizing welcome ornament for any doorway.',
      shortDescription: 'Hand-crocheted peacock motif door latkan with jewel-toned tassels and mirror reflections.',
      categorySlug: 'door-hangings',
      sku: 'RD-DOR-003',
      price: 369,
      mrp: 599,
      discount: 38,
      stock: 12,
      lowStockThreshold: 4,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      colors: ['Peacock Royal Blue & Emerald', 'Teal & Gold'],
      material: 'Silky Woolen Yarn, Acrylic Mirrors, Golden Zari',
      dimensions: '26 Inches Length',
      weight: '150 Grams',
      careInstructions: 'Spot clean only. Keep away from excessive moisture.',
      tags: ['Peacock', 'Krishna Decor', 'Mirror Work', 'Blue Green', 'Door Accent'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      rating: 4.7,
      reviewCount: 11,
      variants: [
        { name: 'Single Piece (26")', sku: 'RD-DOR-003-26', price: 369, mrp: 599, stock: 12, size: '26 inches', color: 'Peacock Royal Blue & Emerald' },
      ],
    },
    {
      name: 'Handmade Woolen & Macrame Mandala Wall Hanging',
      slug: 'handmade-woolen-macrame-mandala-wall-hanging',
      description: 'A striking blend of Indian traditional handicraft and bohemian home aesthetics. Features a central hand-woven wool mandala framed by natural cotton macrame cords, suspended from a sturdy polished pinewood dowel. Adds texture, warmth, and soulful artisanal charm to living rooms, bedrooms, or entry hallways.',
      shortDescription: 'Boho-Indian artisanal wall hanging with hand-woven woolen mandala and natural cotton macrame.',
      categorySlug: 'wall-decor',
      sku: 'RD-WAL-001',
      price: 699,
      mrp: 1299,
      discount: 46,
      stock: 9,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      colors: ['Ivory & Earth Terracotta', 'Mustard & Sage'],
      material: '100% Unbleached Cotton Cords, Woolen Yarn, Solid Pine Wood',
      dimensions: '22 x 34 Inches (Width x Height)',
      weight: '450 Grams',
      careInstructions: 'Comb fringe lightly with wide-tooth comb. Shake gently to remove dust.',
      tags: ['Wall Hanging', 'Macrame', 'Mandala', 'Boho Decor', 'Handicraft'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      rating: 4.9,
      reviewCount: 18,
      variants: [
        { name: 'Standard (22"x34")', sku: 'RD-WAL-001-STD', price: 699, mrp: 1299, stock: 9, size: '22x34 inches', color: 'Ivory & Earth Terracotta' },
      ],
    },
    {
      name: 'Handcrafted Traditional Mirror & Woolen Jharokha Hanging',
      slug: 'handcrafted-traditional-mirror-woolen-jharokha-hanging',
      description: 'Evoking the royal architectural arches of Rajasthan, this hanging jharokha features real reflection mirrors encased in intricate woolen braided cords, finished with colorful woolen tassels and miniature brass bells.',
      shortDescription: 'Rajasthani style mirror-work woolen jharokha wall hanging with hanging tassel bells.',
      categorySlug: 'wall-decor',
      sku: 'RD-WAL-002',
      price: 599,
      mrp: 1099,
      discount: 45,
      stock: 11,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      colors: ['Terracotta Orange & Gold', 'Royal Blue & Crimson'],
      material: 'Reflective Glass Mirror, Woolen Yarn, Wooden Base',
      dimensions: '14 x 28 Inches',
      weight: '380 Grams',
      careInstructions: 'Clean mirror glass with glass cleaner; brush wool with soft bristles.',
      tags: ['Jharokha', 'Mirror Work', 'Rajasthani Decor', 'Wall Hanging', 'Festive'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      rating: 4.8,
      reviewCount: 22,
      variants: [
        { name: 'Standard 14"x28"', sku: 'RD-WAL-002-STD', price: 599, mrp: 1099, stock: 11, size: '14x28 inches', color: 'Terracotta Orange & Gold' },
      ],
    },
    {
      name: 'Festive Marigold & Wool Pom-Pom Garland Set (Pack of 5)',
      slug: 'festive-marigold-wool-pom-pom-garland-set-pack-of-5',
      description: 'Long-lasting, reusable festive garlands made of fluffy handmade woolen pompoms designed to replicate fresh genda phool (marigold). Perfect for temple backdrops, balcony railings, photo booth walls, and festive ceremonies year after year.',
      shortDescription: 'Pack of 5 reusable 5-foot fluffy marigold woolen pom-pom garlands for pooja and festivals.',
      categorySlug: 'festive-decor',
      sku: 'RD-FST-001',
      price: 749,
      mrp: 1399,
      discount: 46,
      stock: 20,
      lowStockThreshold: 5,
      images: [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      colors: ['Orange & Yellow Marigold', 'Deep Red & Gold'],
      material: 'High-Density Woolen Pom-Poms & Braided Nylon Cord',
      dimensions: '5 Feet Length Each (Pack of 5)',
      weight: '480 Grams (Total)',
      careInstructions: 'Shake gently after unpacking to fluff pompoms. Hand wash if needed.',
      tags: ['Marigold', 'Genda Phool', 'Diwali Garland', 'Pack of 5', 'Festive Decor'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      rating: 5.0,
      reviewCount: 47,
      variants: [
        { name: 'Pack of 5 (5 Ft Each)', sku: 'RD-FST-001-5PK', price: 749, mrp: 1399, stock: 20, size: '5 feet x 5 pcs', color: 'Orange & Yellow Marigold' },
      ],
    },
    {
      name: 'Festive Diya Backdrop Woolen Hanging with Tassels',
      slug: 'festive-diya-backdrop-woolen-hanging-with-tassels',
      description: 'Crafted as a complete sacred altar backdrop. Features illuminated golden diya motifs intricately embroidered on handloom wool fabric, flanked by cascading multicolored pom-pom strings and tinkling brass bells.',
      shortDescription: 'Sacred altar backdrop with golden diya embroidery and woolen tassel cascades.',
      categorySlug: 'festive-decor',
      sku: 'RD-FST-002',
      price: 899,
      mrp: 1599,
      discount: 44,
      stock: 8,
      lowStockThreshold: 2,
      images: [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      colors: ['Crimson Red & Golden Zari', 'Deep Ochre Yellow'],
      material: 'Woolen Felt, Zari Embroidery, Pure Brass Bells',
      dimensions: '36 x 42 Inches',
      weight: '520 Grams',
      careInstructions: 'Spot clean only. Store wrapped in soft muslin.',
      tags: ['Diya Backdrop', 'Mandir Backdrop', 'Diwali Decor', 'Pooja Essential'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      rating: 4.8,
      reviewCount: 14,
      variants: [
        { name: 'Standard 36"x42"', sku: 'RD-FST-002-36', price: 899, mrp: 1599, stock: 8, size: '36x42 inches', color: 'Crimson Red & Golden Zari' },
      ],
    },
    {
      name: 'Multicolor Pom-Pom Woolen Latkan for Curtains & Pillars',
      slug: 'multicolor-pom-pom-woolen-latkan-curtains-pillars',
      description: 'Handmade garland strings overflowing with vibrant, hand-shaped woolen pom-poms in joyful rainbow tones, separated by wooden beads and ending in bell charms. Versatile for curtain tie-backs, pillars, windows, or bedroom headboards.',
      shortDescription: 'Joyful multicolor pom-pom string latkan for curtains, doors, and decorative pillars.',
      categorySlug: 'handmade-handicrafts',
      sku: 'RD-HND-001',
      price: 299,
      mrp: 499,
      discount: 40,
      stock: 28,
      lowStockThreshold: 6,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      colors: ['Festive Rainbow Multi', 'Pastel Blossom'],
      material: 'Soft Acrylic Wool & Polished Mango Wood Beads',
      dimensions: '40 Inches Length',
      weight: '160 Grams',
      careInstructions: 'Gently shake off dust. Spot clean if needed.',
      tags: ['Pom Pom', 'Curtain Latkan', 'Multicolor', 'Handmade', 'Kids Room'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      rating: 4.7,
      reviewCount: 31,
      variants: [
        { name: 'Single 40" String', sku: 'RD-HND-001-40', price: 299, mrp: 499, stock: 28, size: '40 inches', color: 'Festive Rainbow Multi' },
      ],
    },
    {
      name: 'Sacred Swastik & Kalash Entrance Door Latkans (Pair)',
      slug: 'sacred-swastik-kalash-entrance-door-latkans-pair',
      description: 'Holy symbols crafted with fine woolen threadwork. Features the sacred Swastik and Kalash on plush circular medallions, bordered with pearl lace and completed with soft woolen drops. Bestows serenity and positivity upon home occupants.',
      shortDescription: 'Traditional pair of Swastik and Kalash auspicious entrance door hangings.',
      categorySlug: 'door-hangings',
      sku: 'RD-DOR-004',
      price: 449,
      mrp: 799,
      discount: 44,
      stock: 14,
      lowStockThreshold: 4,
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      colors: ['Vermillion Red & Gold', 'Deep Green & Gold'],
      material: 'Woolen Embroidery, Zari, Faux Pearls',
      dimensions: '28 Inches Length Each',
      weight: '210 Grams (Pair)',
      careInstructions: 'Dust with a soft brush. Keep dry.',
      tags: ['Swastik', 'Kalash', 'Auspicious Latkan', 'Door Hanging', 'Puja Room'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      rating: 4.9,
      reviewCount: 16,
      variants: [
        { name: 'Pair (2 Pcs)', sku: 'RD-DOR-004-PR', price: 449, mrp: 799, stock: 14, size: '28 inches', color: 'Vermillion Red & Gold' },
      ],
    },
    {
      name: 'Delicate Pearl & Rose Woolen Mandir Chandelier Hanging',
      slug: 'delicate-pearl-rose-woolen-mandir-chandelier-hanging',
      description: 'A 3-tier circular chandelier crafted from delicate hand-crocheted roses in shades of ivory and blush pink, linked by cascading garlands of luminous pearl beads. Designed to be suspended right above your home temple or foyer.',
      shortDescription: '3-tier circular mandir chandelier with hand-crocheted roses and pearl bead cascades.',
      categorySlug: 'pooja-decor-thali-posh',
      sku: 'RD-POJ-001',
      price: 649,
      mrp: 1199,
      discount: 46,
      stock: 7,
      lowStockThreshold: 2,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      colors: ['Ivory & Blush Pink', 'Golden Yellow & Ivory'],
      material: 'Fine Crochet Wool, High-Luster Acrylic Pearls, Metal Frame',
      dimensions: '10 Inch Diameter, 24 Inch Total Drop',
      weight: '320 Grams',
      careInstructions: 'Gentle dusting with blow dryer on cool setting.',
      tags: ['Mandir Chandelier', 'Temple Decor', 'Rose Crochet', 'Pearls', 'Pooja Altar'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      rating: 5.0,
      reviewCount: 21,
      variants: [
        { name: '10" Chandelier', sku: 'RD-POJ-001-10', price: 649, mrp: 1199, stock: 7, size: '10" dia x 24" drop', color: 'Ivory & Blush Pink' },
      ],
    },
    {
      name: 'Traditional Mango Leaf & Gota Patti Auspicious Toran',
      slug: 'traditional-mango-leaf-gota-patti-auspicious-toran',
      description: 'Recreating the sacred Vedic mango leaf bandarwal in everlasting handcrafted wool and shimmering gota ribbon. Embellished with golden embroidery and tiny bells.',
      shortDescription: 'Traditional handcrafted mango leaf design toran with golden gota patti trims.',
      categorySlug: 'toran-bandarwal',
      sku: 'RD-TOR-003',
      price: 479,
      mrp: 849,
      discount: 44,
      stock: 15,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      colors: ['Leaf Green & Gold', 'Forest Green & Red'],
      material: 'Woolen Felt, Gota Patti, Brass Ghungroos',
      dimensions: '38 x 8 Inches',
      weight: '240 Grams',
      careInstructions: 'Spot clean only. Store flat in clean plastic envelope.',
      tags: ['Mango Leaf Toran', 'Bandhanwar', 'Auspicious', 'Housewarming', 'Diwali'],
      featured: false,
      bestSeller: true,
      newArrival: false,
      rating: 4.8,
      reviewCount: 26,
      variants: [
        { name: 'Standard 38"', sku: 'RD-TOR-003-38', price: 479, mrp: 849, stock: 15, size: '38 inches', color: 'Leaf Green & Gold' },
      ],
    },
    {
      name: 'Sunflower Motif Hand-Knitted Woolen Bandarwal',
      slug: 'sunflower-motif-hand-knitted-woolen-bandarwal',
      description: 'Cheerful bright sunflower florets hand-knitted with golden-yellow and chocolate brown wool yarn. Perfect for main entrances, kitchen archways, or balcony doorways.',
      shortDescription: 'Bright sunflower floral hand-knitted woolen door toran with wooden bead accents.',
      categorySlug: 'toran-bandarwal',
      sku: 'RD-TOR-004',
      price: 529,
      mrp: 899,
      discount: 41,
      stock: 13,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      colors: ['Sunflower Golden Yellow & Brown'],
      material: '100% Acrylic Soft Wool',
      dimensions: '38 x 7.5 Inches',
      weight: '250 Grams',
      careInstructions: 'Gentle hand wash in cold water with liquid wool wash.',
      tags: ['Sunflower Toran', 'Floral Bandarwal', 'Yellow Decor', 'Hand Knitted'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      rating: 4.7,
      reviewCount: 13,
      variants: [
        { name: 'Standard 38"', sku: 'RD-TOR-004-38', price: 529, mrp: 899, stock: 13, size: '38 inches', color: 'Sunflower Golden Yellow & Brown' },
      ],
    },
    {
      name: 'Festive Haldi-Kumkum Decorative Plate Cover (Pack of 2)',
      slug: 'festive-haldi-kumkum-decorative-plate-cover-pack-of-2',
      description: 'Pair of mini 8-inch hand-crocheted decorative covers tailored for Haldi-Kumkum platters, sweet bowls, or dry fruit trays. Embellished with fine golden beads.',
      shortDescription: 'Set of 2 mini 8-inch crochet covers for Haldi-Kumkum platters and sweet bowls.',
      categorySlug: 'pooja-decor-thali-posh',
      sku: 'RD-POJ-002',
      price: 249,
      mrp: 449,
      discount: 45,
      stock: 30,
      lowStockThreshold: 8,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      colors: ['Haldi Yellow & Kumkum Red'],
      material: '100% Mercerized Cotton & Golden Beads',
      dimensions: '8 Inch Diameter (Set of 2)',
      weight: '90 Grams',
      careInstructions: 'Hand wash gently. Dry flat on towel.',
      tags: ['Haldi Kumkum', 'Pooja Thali Cover', 'Mini Cover', 'Set of 2', 'Festive Gift'],
      featured: false,
      bestSeller: false,
      newArrival: false,
      rating: 4.8,
      reviewCount: 17,
      variants: [
        { name: 'Pack of 2 (8")', sku: 'RD-POJ-002-PK2', price: 249, mrp: 449, stock: 30, size: '8 inches', color: 'Haldi Yellow & Kumkum Red' },
      ],
    },
    {
      name: 'Artisanal Macrame & Wool Bohemian Door Valence',
      slug: 'artisanal-macrame-wool-bohemian-door-valence',
      description: 'A contemporary crossover piece featuring textured macrame knotwork combined with chunky woolen yarn in warm terracotta, cream, and sand. Hangs above doorways or windows to add luxury boho vibes.',
      shortDescription: 'Boho-chic handcrafted door valence with natural cotton macrame and warm earthy wool.',
      categorySlug: 'wall-decor',
      sku: 'RD-WAL-003',
      price: 799,
      mrp: 1499,
      discount: 47,
      stock: 8,
      lowStockThreshold: 2,
      images: [
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      colors: ['Warm Terracotta & Sand', 'Natural Off-White'],
      material: '100% Recycled Cotton Macrame & New Zealand Wool',
      dimensions: '36 x 14 Inches',
      weight: '490 Grams',
      careInstructions: 'Spot clean. Comb fringe carefully.',
      tags: ['Macrame Valence', 'Door Valence', 'Boho Home', 'Terracotta', 'Handicrafts'],
      featured: true,
      bestSeller: false,
      newArrival: true,
      rating: 4.9,
      reviewCount: 14,
      variants: [
        { name: 'Standard 36"', sku: 'RD-WAL-003-36', price: 799, mrp: 1499, stock: 8, size: '36 inches', color: 'Warm Terracotta & Sand' },
      ],
    },
    {
      name: 'Ganesh Chaturthi Auspicious Welcome Bandarwal',
      slug: 'ganesh-chaturthi-auspicious-welcome-bandarwal',
      description: 'Dedicated to Vighnaharta Lord Ganesha. Adorned with a central embossed golden Ganesha medallion, surrounded by handmade modak-shaped woolen pom-poms, festive marigold colors, and sacred bell drops.',
      shortDescription: 'Ganeshji centerpiece toran with marigold woolen pompoms and chiming brass bells.',
      categorySlug: 'festive-decor',
      sku: 'RD-FST-003',
      price: 579,
      mrp: 999,
      discount: 42,
      stock: 16,
      lowStockThreshold: 3,
      images: [
        'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      colors: ['Saffron Orange & Royal Maroon'],
      material: 'Acrylic Wool, Brass Bells, Antique Gold Plated Medallion',
      dimensions: '39 x 9.5 Inches',
      weight: '310 Grams',
      careInstructions: 'Wipe metal parts with dry cloth. Store in airtight container after festivals.',
      tags: ['Ganesh Toran', 'Ganesh Chaturthi', 'Bandarwal', 'Mandir Entrance', 'Festive'],
      featured: true,
      bestSeller: true,
      newArrival: false,
      rating: 5.0,
      reviewCount: 39,
      variants: [
        { name: 'Standard 39"', sku: 'RD-FST-003-39', price: 579, mrp: 999, stock: 16, size: '39 inches', color: 'Saffron Orange & Royal Maroon' },
      ],
    },
    {
      name: 'Handcrafted Woolen Floral Balcony & Garden Garland',
      slug: 'handcrafted-woolen-floral-balcony-garden-garland',
      description: 'Brighten your balcony railing, reading nook, or garden patio with this multi-color pastel floral woolen garland. Resilient, color-fast, and designed to bring smiles.',
      shortDescription: 'Pastel blossom woolen garland for balcony railings, windows, and cozy corners.',
      categorySlug: 'handmade-handicrafts',
      sku: 'RD-HND-002',
      price: 389,
      mrp: 699,
      discount: 44,
      stock: 17,
      lowStockThreshold: 4,
      images: [
        'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      ],
      thumbnail: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=800&auto=format&fit=crop&q=80',
      colors: ['Pastel Pink, Mint & Cream'],
      material: 'Soft Acrylic Yarn & Beaded Wooden Ends',
      dimensions: '6 Feet Length',
      weight: '190 Grams',
      careInstructions: 'Hand wash gently in lukewarm water.',
      tags: ['Balcony Decor', 'Floral Garland', 'Pastel Decor', 'Handicraft', 'Spring'],
      featured: false,
      bestSeller: false,
      newArrival: true,
      rating: 4.8,
      reviewCount: 15,
      variants: [
        { name: '6-Foot Single', sku: 'RD-HND-002-6FT', price: 389, mrp: 699, stock: 17, size: '6 feet', color: 'Pastel Pink, Mint & Cream' },
      ],
    },
  ];

  const createdProducts = [];

  for (const item of productsData) {
    const { categorySlug, variants, ...prodData } = item;
    const categoryId = categoryMap[categorySlug];

    const product = await prisma.product.create({
      data: {
        ...prodData,
        categoryId,
        images: JSON.stringify(prodData.images),
        colors: JSON.stringify(prodData.colors),
        tags: JSON.stringify(prodData.tags),
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock,
            size: v.size,
            color: v.color,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    createdProducts.push(product);
  }

  console.log(`🛍️ Created ${createdProducts.length} authentic Rouniyar Decor products.`);

  // 4. Create Coupons
  const couponsData = [
    {
      code: 'WELCOME100',
      description: 'Flat ₹100 Off on your first order above ₹499',
      discountType: 'FLAT',
      discountValue: 100,
      minOrderValue: 499,
      maxDiscount: 100,
      usageLimit: 1000,
      active: true,
    },
    {
      code: 'FESTIVE15',
      description: '15% Off on festive decor orders above ₹799 (Max ₹300)',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValue: 799,
      maxDiscount: 300,
      usageLimit: 500,
      active: true,
    },
    {
      code: 'HANDMADE10',
      description: '10% Off on all authentic handmade crafts',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 599,
      maxDiscount: 250,
      usageLimit: 300,
      active: true,
    },
    {
      code: 'ROUNIYAR20',
      description: 'Flat 20% Off on orders above ₹1,299 (Max ₹500)',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 1299,
      maxDiscount: 500,
      usageLimit: 200,
      active: true,
    },
    {
      code: 'FREESHIP',
      description: 'Free Shipping discount on any order above ₹399',
      discountType: 'FLAT',
      discountValue: 50,
      minOrderValue: 399,
      maxDiscount: 50,
      usageLimit: 1000,
      active: true,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.create({ data: c });
  }
  console.log('🎟️ Created 5 discount coupons.');

  // 5. Create Reviews
  const reviewsData = [
    {
      productId: createdProducts[0].id,
      userId: user1.id,
      customerName: 'Ananya Sharma',
      rating: 5,
      title: 'Stunning craftsmanship, exact as pictured!',
      comment: 'I ordered this toran for our main wooden door before Diwali and received countless compliments from neighbors. The wool is so soft and thick, and the brown pom-pom gondas have a lovely earthy look.',
      approved: true,
    },
    {
      productId: createdProducts[0].id,
      userId: user2.id,
      customerName: 'Rahul Verma',
      rating: 5,
      title: 'Great quality and fast delivery',
      comment: 'Packaging was very secure, reached in 3 days. Real handmade feel, not cheap plastic. Very happy with Rouniyar Decor.',
      approved: true,
    },
    {
      productId: createdProducts[2].id,
      userId: user3.id,
      customerName: 'Priya Sundaram',
      rating: 5,
      title: 'Perfect size for our brass pooja thali',
      comment: 'Fits my 15-inch brass aarti plate like a dream. The yellow and red color combo looks so auspicious during our morning prayers.',
      approved: true,
    },
    {
      productId: createdProducts[3].id,
      userId: user1.id,
      customerName: 'Ananya Sharma',
      rating: 5,
      title: 'Royal look for temple room',
      comment: 'The velvet center and lotus petals give a very luxurious feel to the mandir. Truly handcrafted beauty.',
      approved: true,
    },
    {
      productId: createdProducts[4].id,
      userId: user2.id,
      customerName: 'Rahul Verma',
      rating: 5,
      title: 'Auspicious addition to our new home',
      comment: 'The brass bells chime softly when the door moves. Beautifully made Shubh Labh hangings.',
      approved: true,
    },
    {
      productId: createdProducts[9].id,
      userId: user3.id,
      customerName: 'Priya Sundaram',
      rating: 5,
      title: 'Looks just like fresh genda phool!',
      comment: 'Ordered the 5-pack for our entrance. We reuse them every festival and they never wilt or shed threads. Worth every rupee.',
      approved: true,
    },
  ];

  for (const r of reviewsData) {
    await prisma.review.create({ data: r });
  }
  console.log('⭐ Created customer reviews.');

  // 6. Create Realistic Orders
  const sampleOrders = [
    {
      orderNumber: 'RD-2025-1001',
      userId: user1.id,
      customerName: 'Ananya Sharma',
      customerEmail: 'ananya@example.com',
      customerMobile: '+91 98111 22334',
      shippingAddress: JSON.stringify({
        name: 'Ananya Sharma',
        mobile: '+91 98111 22334',
        houseFlat: 'Flat 402, Lotus Towers',
        street: 'Koramangala 4th Block',
        area: 'Near Sony World Junction',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034',
        landmark: 'Opposite Cafe Coffee Day',
      }),
      deliveryMethod: 'Express Delivery (2-3 Days)',
      paymentMethod: 'Razorpay',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      subtotal: 1248,
      discount: 100,
      couponCode: 'WELCOME100',
      shippingFee: 0,
      tax: 0,
      total: 1148,
      razorpayOrderId: 'order_test_9011',
      razorpayPaymentId: 'pay_test_9011_success',
      trackingNumber: 'DTDC88291039IN',
      createdAt: new Date(Date.now() - 14 * 86400000), // 14 days ago
      items: [
        {
          productId: createdProducts[0].id,
          variantId: createdProducts[0].variants[0]?.id,
          name: createdProducts[0].name,
          sku: createdProducts[0].variants[0]?.sku || createdProducts[0].sku,
          price: 499,
          quantity: 1,
          image: createdProducts[0].thumbnail,
          color: 'White & Earth Brown',
          size: '38 inches',
        },
        {
          productId: createdProducts[9].id,
          variantId: createdProducts[9].variants[0]?.id,
          name: createdProducts[9].name,
          sku: createdProducts[9].variants[0]?.sku || createdProducts[9].sku,
          price: 749,
          quantity: 1,
          image: createdProducts[9].thumbnail,
          color: 'Orange & Yellow Marigold',
          size: '5 feet x 5 pcs',
        },
      ],
    },
    {
      orderNumber: 'RD-2025-1002',
      userId: user2.id,
      customerName: 'Rahul Verma',
      customerEmail: 'rahul@example.com',
      customerMobile: '+91 98222 33445',
      shippingAddress: JSON.stringify({
        name: 'Rahul Verma',
        mobile: '+91 98222 33445',
        houseFlat: 'B-12, Green Glen Layout',
        street: 'Bellandur Main Road',
        area: 'Outer Ring Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560103',
        landmark: 'Near EcoSpace Tech Park',
      }),
      deliveryMethod: 'Standard Delivery (3-5 Days)',
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      orderStatus: 'SHIPPED',
      subtotal: 778,
      discount: 0,
      shippingFee: 0,
      tax: 0,
      total: 778,
      razorpayOrderId: 'order_test_9012',
      razorpayPaymentId: 'pay_test_9012_success',
      trackingNumber: 'BLUEDART551920IN',
      createdAt: new Date(Date.now() - 3 * 86400000), // 3 days ago
      items: [
        {
          productId: createdProducts[2].id,
          variantId: createdProducts[2].variants[0]?.id,
          name: createdProducts[2].name,
          sku: createdProducts[2].variants[0]?.sku || createdProducts[2].sku,
          price: 349,
          quantity: 1,
          image: createdProducts[2].thumbnail,
          color: 'Turmeric Yellow & Red',
          size: '16 inches',
        },
        {
          productId: createdProducts[5].id,
          variantId: createdProducts[5].variants[0]?.id,
          name: createdProducts[5].name,
          sku: createdProducts[5].variants[0]?.sku || createdProducts[5].sku,
          price: 429,
          quantity: 1,
          image: createdProducts[5].thumbnail,
          color: 'Antique Gold & Crimson',
          size: '30 inches',
        },
      ],
    },
    {
      orderNumber: 'RD-2025-1003',
      userId: user3.id,
      customerName: 'Priya Sundaram',
      customerEmail: 'priya@example.com',
      customerMobile: '+91 98333 44556',
      shippingAddress: JSON.stringify({
        name: 'Priya Sundaram',
        mobile: '+91 98333 44556',
        houseFlat: 'A-204, Shanti Niketan',
        street: 'Jayanagar 7th Block',
        area: 'Near South End Circle',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560070',
        landmark: 'Near Krishna Temple',
      }),
      deliveryMethod: 'Standard Delivery (3-5 Days)',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'PENDING',
      orderStatus: 'CONFIRMED',
      subtotal: 699,
      discount: 0,
      shippingFee: 50,
      tax: 0,
      total: 749,
      notes: 'Please call before delivery',
      createdAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
      items: [
        {
          productId: createdProducts[7].id,
          variantId: createdProducts[7].variants[0]?.id,
          name: createdProducts[7].name,
          sku: createdProducts[7].variants[0]?.sku || createdProducts[7].sku,
          price: 699,
          quantity: 1,
          image: createdProducts[7].thumbnail,
          color: 'Ivory & Earth Terracotta',
          size: '22x34 inches',
        },
      ],
    },
    {
      orderNumber: 'RD-2025-1004',
      customerName: 'Vikram Mehta',
      customerEmail: 'vikram.m@example.com',
      customerMobile: '+91 97777 88899',
      shippingAddress: JSON.stringify({
        name: 'Vikram Mehta',
        mobile: '+91 97777 88899',
        houseFlat: 'Plot 45, Sector 14',
        street: 'MG Road',
        area: 'Civil Lines',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122001',
      }),
      deliveryMethod: 'Standard Delivery',
      paymentMethod: 'Razorpay',
      paymentStatus: 'PAID',
      orderStatus: 'OUT_FOR_DELIVERY',
      subtotal: 579,
      discount: 0,
      shippingFee: 0,
      tax: 0,
      total: 579,
      razorpayOrderId: 'order_test_9014',
      razorpayPaymentId: 'pay_test_9014_success',
      trackingNumber: 'DELHIVERY440192',
      createdAt: new Date(Date.now() - 2 * 86400000),
      items: [
        {
          productId: createdProducts[18].id,
          variantId: createdProducts[18].variants[0]?.id,
          name: createdProducts[18].name,
          sku: createdProducts[18].variants[0]?.sku || createdProducts[18].sku,
          price: 579,
          quantity: 1,
          image: createdProducts[18].thumbnail,
          color: 'Saffron Orange & Royal Maroon',
        },
      ],
    },
  ];

  for (const ord of sampleOrders) {
    const { items, ...orderData } = ord;
    const createdOrder = await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            name: it.name,
            sku: it.sku,
            price: it.price,
            quantity: it.quantity,
            image: it.image,
            color: it.color,
            size: it.size,
          })),
        },
      },
    });

    if (ord.paymentStatus === 'PAID') {
      await prisma.payment.create({
        data: {
          orderId: createdOrder.id,
          amount: ord.total,
          currency: 'INR',
          status: 'SUCCESS',
          method: ord.paymentMethod.toUpperCase(),
          transactionId: ord.razorpayPaymentId || 'TXN_' + Date.now(),
        },
      });
    }
  }

  console.log('📦 Created sample orders with payments and line items.');

  console.log('✅ DATABASE SEED COMPLETE!');
  console.log('----------------------------------------------------');
  console.log('Admin Demo Login:');
  console.log('Email: admin@rouniyardecor.com');
  console.log('Password: admin123');
  console.log('----------------------------------------------------');
  console.log('Customer Demo Login:');
  console.log('Email: ananya@example.com');
  console.log('Password: customer123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
