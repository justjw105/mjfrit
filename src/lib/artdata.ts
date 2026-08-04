export type ArtPiece = {
  id: number;
  slug: string;
  title: string;
  imageUrl: string;
  imageHint: string;
  description: string;
  technicalDetails: string;
  price: number;
  size: string;
  framedSize?: string;
  unframedSize?: string;
  alt: string;
  /** ISO date (YYYY-MM-DD) this piece was last updated/added. Used for sitemap lastModified. */
  updatedAt: string;
};

export const artPieces: ArtPiece[] = [
  {
    id: 1,
    slug: "desert-storm-fused-glass",
    title: "Dust Storm",
    imageUrl: "/PXL_20250821_014641259.MP.jpg",
    imageHint: "Desert scape",
    description: "Capture the dramatic beauty of the American Southwest with this unique desert landscape glass art. Masterful use of vibrant glass color creates a striking sense of movement within the distant storm clouds, bringing the dynamic desert sky to life. The detailed foreground features native cacti and lush desert plants, perfectly framing the iconic rolling red hills inspired by the breathtaking scenery just outside St. George, Utah. This one of a kind, unique piece is a perfect addition for anyone looking to elevate their home decor with authentic Southwestern charm. ",
    technicalDetails:"Initial glass used was clear and the majority of the piece is translucent giving a unique view to both front and back.",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 2500,
    alt: "Glass art depicting a Southwest American desert landscape featuring St. George Utah's rolling red hills, foreground cacti, and dynamic storm clouds.",
    updatedAt: "2025-08-21"
  },
  {
    id: 2,
    slug: "scottish-highland-fall-art",
    title: "The Autumn Hills of the Highlands",
    imageUrl: "/PXL_20250821_014252785.jpg",
    imageHint: "Highland autumn hills",
    description: "Immerse yourself in the dramatic beauty of the Scottish Highlands with this exquisite fused glass art piece. Inspired by the iconic Lagangarbh Hut, a historical landmark of the Scottish National Trust, and the majestic Buachaille Etive Mòr mountain near Glencoe, this artwork captures the essence of an autumn day. The piece vividly portrays the River Etive, reflecting the vibrant reeds along its banks, the expansive sky above, and the imposing mountain ridges partially veiled by storm clouds. The rich, warm hues of autumn foliage are rendered in intricate detail, bringing the rugged landscape to life. This unique glass art offers a captivating interpretation of a beloved Scottish scene, perfect for collectors of fine art, Scottish landscape enthusiasts, and those seeking a distinctive piece of home decor.",
    technicalDetails:"Initial background glass used in this piece was white, very little translucence in the overall piece.",
    size: "11x14 unframed",
    framedSize: "13x16 inches",
    unframedSize: "11x14 inches",
    price: 1700,
    alt: "Handcrafted fused glass fine art depicting the historic Lagangarbh Hut in vibrant autumn colors, nestled in the Scottish Highlands near Glencoe, with Buachaille Etive Mòr mountain partially hidden by dramatic storm clouds. The foreground features the reflective waters of the River Etive, mirroring reeds along the banks, the sky, and the mountain ridges.",
    updatedAt: "2025-08-21"
  },
  {
    id: 3,
    slug: "rocky-mountain-pine-fused-glass",
    title: "Wild Mountain Pines",
    imageUrl: "/PXL_20250821_014137707.jpg",
    imageHint: "Highland autumn hills",
    description: "Bring the untouched wilderness of the North American Rocky Mountains into your home with this handcrafted fine glass landscape. Depicting a pristine mountain river winding through lush evergreen forests at the turning of late summer, this artwork captures first snowfall on high alpine peaks while golden Quaking Aspens begin their autumn transition along the water's edge. Designed with remarkable depth and transparency, this piece celebrates pure wilderness with zero human footprint—ideal for nature lovers, rustic home decor, and collectors of Rocky Mountain fine art.",
    technicalDetails:"Initial glass used was clear and the piece has transparency throughout.",
    size: "18x12 unframed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 2500,
    alt: "Handcrafted fused glass artwork of the North American Rocky Mountains featuring evergreen pine forests, golden Quaking Aspens, a rushing river, and early snow on high alpine peaks.",
    updatedAt: "2025-08-21"
  },
  {
    id: 4,
    slug: "scotland-heather-hills-fused-glass",
    title: "Heather Covered Hills",
    imageUrl: "/PXL_20250821_014331798.jpg",
    imageHint: "Heather Covered Hills",
    description: "Capture the mystical allure of the Scottish Highlands with this evocative fused glass artwork depicting heather-covered hills overlooking Loch Ness near historic Urquhart Castle. Masterfully layered with rich violet and earth tones, this piece portrays dramatic, rolling storm clouds contrasting with still waters that mirror the calm before a Highland tempest. Perfect for collectors of Scottish landscape art and fine glasswork, this scene transports the rugged romance of Scotland into any fine art collection.",
    technicalDetails:"The piece is mildly translucent throughout.",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 2750,
    alt: "Handcrafted fused glass Scottish landscape depicting purple heather-covered hills overlooking Loch Ness near Urquhart Castle under dramatic stormy Highland skies.",
    updatedAt: "2025-08-21"
  },
  {
    id: 5,
    slug: "fall-fused-glass-natureland",
    title: "Autumn comes to Natureland",
    imageUrl: "/PXL_20250823_030515662.jpg",
    imageHint: "Autumn comes to Natureland",
    description: "Celebrate the golden beauty of a Midwest autumn with this handcrafted glass landscape inspired by the scenic woodland trails of Natureland Park along Whitewater Lake in Wisconsin. Featuring rich crimson, burnt orange, and amber glass frit layered over an opalescent woodland canopy, this artwork evokes a peaceful fall walk along a sun-dappled trail. An exceptional statement piece for lovers of autumn foliage, Wisconsin nature landmarks, and handcrafted American glass art.",
    technicalDetails:"The sky is the most transparent area of the glass and the remainder of the piece is opalescent.",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 2750,
    alt: "Handcrafted autumn fused glass landscape depicting a scenic fall woodland trail at Natureland Park near Whitewater Lake, Wisconsin, with vibrant amber and crimson foliage.",
    updatedAt: "2025-08-23"
  },
  {
    id: 6,
    slug: "handmade-fused-glass-mt-rainier",
    title: "The Mists at Mount Rainier",
    imageUrl: "/PXL_20250823_030308678.jpg",
    imageHint: "The Mists at Mount Rainier",
    description: "Experience the majestic serenity of the Pacific Northwest with this handcrafted fine glass artwork depicting iconic Mount Rainier at dusk. Masterfully composed with layered glass frit, this unique mountain landscape captures the delicate moment when twilight casts vibrant violet and purple hues across drifting alpine mists before deepening into sapphire night skies. Designed for collectors of Pacific Northwest fine art, nature lovers, and mountain landscape enthusiasts, this heirloom-quality glass piece brings the awe-inspiring presence of Mount Rainier into any home or gallery space.",
    technicalDetails:"The piece is mildly translucent throughout.",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 3000,
    alt: "Handcrafted fine glass art of Mount Rainier at sunset with vibrant purple alpine mists, Pacific Northwest mountain landscape, and evening twilight glow.",
    updatedAt: "2025-08-23"
  },
  {
    id: 7,
    slug: "the-white-mountains-version-2",
    title: "The White Mountains version 2",
    imageUrl: "/PXL_20251031_023254605.jpg",
    imageHint: "The White Mountains version 2",
    description: "Experience the breathtaking fall foliage of New England with this handcrafted fine glass artwork inspired by the majestic White Mountains in autumn. Kiln-fired four distinct times using specialized streaky white sheet glass as a base, this piece achieves an extraordinary multidimensional sky above a sweeping panorama of fiery autumn foliage. Designed for collectors of New England landscape art and autumn decor, this unique glass sculpture captures the peak vibrancy of mountain fall colors.",
    technicalDetails:"",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 1500,
    alt: "Handcrafted fused glass artwork depicting New England's White Mountains in peak autumn foliage with fiery fall trees against a multidimensional streaky sky.",
    updatedAt: "2025-10-31"
  },
  {
    id: 8,
    slug: "whimsical-forest-fused-glass",
    title: "Whimsical Forest",
    imageUrl: "/PXL_20251031_022958480.jpg",
    imageHint: "Whimsical Forest",
    description: "Immerse yourself in the enchanting tranquility of twilight with this handcrafted forest landscape in fused glass. Depicting a serene woodland stream and reflective forest pools catching the last golden and amber light of dusk, this piece captures the magical moment when day fades into evening solitude. Perfect for lovers of woodland scenery, contemporary glass art, and serene nature-inspired home decor.",
    technicalDetails:"",
    size: "14x11 framed",
    framedSize: "14x11 inches",
    unframedSize: "12x9 inches",
    price: 1000,
    alt: "Handcrafted fused glass woodland artwork depicting a tranquil forest stream and pools reflecting the warm golden hues of sunset at dusk.",
    updatedAt: "2025-10-31"
  },
  {
    id: 9,
    slug: "fused-glass-mount-fuji-art",
    title: "Cherry Blossoms and Mount Fuji version 2",
    imageUrl: "/PXL_20251031_022919820.jpg",
    imageHint: "Cherry Trees and Mt. Fuji version 2",
    description: "Adorn your space with the timeless elegance of Japan with this handcrafted fused glass artwork depicting iconic Mount Fuji framed by blossoming Sakura cherry trees. Featuring realistic scale and meticulous frit layering, this piece captures the serene contrast between delicate pink springtime cherry blossoms and the majestic snow-capped volcanic peak. An exquisite addition for collectors of Japanese landscape art, botanical decor, and fine glasswork.",
    technicalDetails:"",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 1700,
    alt: "Handcrafted fine glass artwork depicting snow-capped Mount Fuji in Japan framed by delicate pink springtime cherry blossom Sakura trees.",
    updatedAt: "2025-10-31"
  },
  {
    id: 10,
    slug: "mount-fuji-cherry-blossoms",
    title: "Cherry Trees and Mt. Fuji version 1",
    imageUrl: "/PXL_20250928_174017906.jpg",
    imageHint: "Cherry Trees and Mt. Fuji version 1",
    description: "Bring a touch of springtime dreamscape into your home with this whimsical handcrafted glass artwork of Mount Fuji viewed through blooming Sakura cherry trees. Characterized by a brilliant cerulean blue sky and delicate, blossom-laden tree boughs, this idealized Japanese landscape radiates joy and tranquility. Perfect as a focal point for Asian-inspired interior decor and lovers of botanical fine art glass.",
    technicalDetails:"",
    size: "20x14 framed",
    framedSize: "20x14 inches",
    unframedSize: "18x12 inches",
    price: 1500,
    alt: "Whimsical handcrafted fused glass artwork of Mount Fuji in springtime with a vivid blue sky and delicate pink cherry blossom boughs.",
    updatedAt: "2025-09-28"
  }
  
];
