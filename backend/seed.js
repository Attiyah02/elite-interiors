const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
require('dotenv').config();

const categories = [
  {
    name: "Living Room",
    description: "Comfortable and stylish living room furniture",
    subcategories: ["Sofas", "Coffee Tables", "TV Units", "Armchairs", "Shelving"],
    icon: "🛋️"
  },
  {
    name: "Bedroom",
    description: "Rest and relaxation furniture",
    subcategories: ["Beds", "Wardrobes", "Nightstands", "Dressers"],
    icon: "🛏️"
  },
  {
    name: "Office",
    description: "Productive workspace furniture",
    subcategories: ["Desks", "Office Chairs", "Bookcases", "Filing Cabinets"],
    icon: "💼"
  },
  {
    name: "Dining",
    description: "Dining and entertaining furniture",
    subcategories: ["Dining Tables", "Dining Chairs", "Bar Stools", "Sideboards"],
    icon: "🍽️"
  },
  {
    name: "Storage",
    description: "Organization and storage solutions",
    subcategories: ["Cabinets", "Drawers", "Shelves", "Storage Boxes"],
    icon: "📦"
  }
];

const products = [
  // LIVING ROOM - Sofas
  {
    name: "Classic Brown Leather Sofa",
    description: "A clean, modern 3-seater sofa with a light wood base. The simple design and smooth brown finish make it easy to match with any home decor.",
    category: "Living Room",
    subcategory: "Sofas",
    price: 4999,
    costPrice: 2500,
    specifications: {
      dimensions: { length: 180, width: 85, height: 90, weight: 45 },
      material: { primary: "Synthetic Leather", frame: "Natural Wood", filling: "High-density foam" },
      seatingCapacity: 3,
      colors: ["Brown"],
      assembly: "Required(Legs only)",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Modern", "Simple", "Classic"]
    },
    images: ["https://images.unsplash.com/photo-1696774276995-93be4dc4b257?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["brown", "tan", "3-seater", "modern", "grey", "living-room"],
    roomType: "Living Room"
  },
  {
    name: "Curved Black Loveseat",
    description: "A stylish 2-seater sofa with a unique curved back and thin metal legs. Its compact size and smooth black finish make it a great choice for modern offices or small living rooms.",
    category: "Living Room",
    subcategory: "Sofas",
    price: 3499,
    costPrice: 1800,
    specifications: {
      dimensions: { length: 140, width: 80, height: 85, weight: 32 },
      material: { primary: "Smooth Sythetic Leather", frame: "Steel", filling: "Firm foam" },
      seatingCapacity: 2,
      colors: ["Black"],
      assembly: "Easy(Legs only)",
      assemblyTime: "10 minutes",
      spaceEfficient: true,
      style: ["Modern", "Urban"]
    },
    images: ["https://images.unsplash.com/photo-1623514814234-d03651636c21?q=80&w=678&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["loveseat", "2-seater", "modern"],
    roomType: "Living Room"
  },
  {
    name: "Cloud Comfort Sectional",
    description: "A low, deep-seated 2-piece sofa with a built-in lounge side. Its soft white fabric and thick cushions make it a cozy and bright addition to any modern living room.",
    category: "Living Room",
    subcategory: "Sofas",
    price: 3999,
    costPrice: 1900,
    specifications: {
      dimensions: { length: 240, width: 160, height: 70, weight: 65 },
      material: { primary: "Textured Cotton Blend", frame: "Solid Wood", filling: "Soft Down and Foam" },
      seatingCapacity: 3,
      colors: ["White", "Off-White", "Light Cream"],
      assembly: "Easy (Connecting pieces)",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Modern", "Cozy"]
    },
    images: ["https://images.unsplash.com/photo-1733547369416-75eb36fb8437?q=80&w=1129&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["white","lounge", "soft", "modern", "large-sofa"],
    roomType: "Living Room"
  },

  // LIVING ROOM - Coffee Tables
  {
    name: "Marble Top Round Coffee Table",
    description: "A stylish small table with a round marble top and a dark wood cross-base. The unique stone pattern and curved wood legs make it a beautiful accent piece for any room.",
    category: "Living Room",
    subcategory: "Coffee Tables",
    price: 1299,
    costPrice: 650,
    specifications: {
      dimensions: { length: 40, width: 40, height: 55, weight: 12 },
      material: { primary: "Whiteand Grey Marble", frame: "Dark Stained Wood" },
      colors: ["White", "Grey", "Dark Brown"],
      assembly: "None",
      assemblyTime: "0 minutes",
      spaceEfficient: true,
      style: ["Modern", "Natural", "Artistic"]
    },
    images: ["https://images.unsplash.com/photo-1692262089751-7e26b69ad8d1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["side-table", "marble", "stone", "dark-wood", "round", "small-space"],
    roomType: "Living Room"
  },
  {
    name: "Grid Pattern Coffee Table",
    description: "A long, rectangular coffee table with a unique black grid-textured top. Its thin metal legs and dark finish give it a clean, industrial look that fits perfectly in modern living rooms.",
    category: "Living Room",
    subcategory: "Coffee Tables",
    price: 1899,
    costPrice: 950,
    specifications: {
      dimensions: { length: 120, width: 60, height: 35, weight: 22 },
      material: { primary: "Textured Wood Composite", frame: "Black Powder-Coated Steel" },
      colors: ["Black", "Dark Charcoal"],
      assembly: "Minimal (Legs only)",
      assemblyTime: "10 minutes",
      spaceEfficient: true,
      style: ["Modern", "Industrial"]
    },
    images: ["https://images.unsplash.com/photo-1575435745494-d25c354515c1?q=80&w=1165&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["coffee-table", "black", "grid", "metal-legs", "industrial", "rectangular"],
    roomType: "Living Room"
  },
  {
    name: "Oval Leaf Coffee Table",
    description: "A low-profile coffee table with a smooth, leaf-shaped wooden top. The unique curved black metal base provides a floating look that complements a modern, airy home.",
    category: "Living Room",
    subcategory: "Coffee Tables",
    price: 1999,
    costPrice: 1000,
    specifications: {
      dimensions: { length: 130, width: 70, height: 30, weight: 20 },
      material: { primary: "Light Oak Veneer", frame: "Black Powder-Coated Steel" },
      colors: ["Light Brown", "Tan", "Oak"],
      assembly: "Easy (Base attachment)",
      assemblyTime: "10 minutes",
      spaceEfficient: true,
      style: ["Modern", "Organic", "Minimalist"]
    },
    images: ["https://images.unsplash.com/photo-1758565811033-84d1365000c6?q=80&w=727&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["oval", "wood", "low-table", "modern", "natural", "living-room"],
    roomType: "Living Room"
  },

  // LIVING ROOM - TV Units
  {
    name: "Minimalist Black TV Stand",
    description: "A low-profile, sturdy black TV unit with two wide open shelves. Its simple rectangular design and dark finish make it a versatile choice for any modern living area.",
    category: "Living Room",
    subcategory: "TV Units",
    price: 1899,
    costPrice: 900,
    specifications: {
      dimensions: { length: 120, width: 35, height: 48, weight: 28 },
      material: { primary: "Painted Wood", frame: "Wood" },
      colors: ["Black", "Dark Charcoal"],
      assembly: "Easy",
      assemblyTime: "20 minutes",
      spaceEfficient: true,
      style: ["Modern", "Simple"]
    },
    images: ["https://images.unsplash.com/photo-1721614460006-cffd837c2e4f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["tv-stand", "black", "modern"],
    roomType: "Living Room"
  },
  {
    name: "Natural Oak 6-Drawer TV Stand",
    description: "A wide, light wood TV unit featuring a unique wave pattern on the drawer fronts. Its large surface and six deep drawers provide plenty of storage for media and home essentials.",
    category: "Living Room",
    subcategory: "TV Units",
    price: 3199,
    costPrice: 2100,
    specifications: {
      dimensions: { length: 180, width: 45, height:75, weight: 55 },
      material: { primary: "Light Oak Wood", frame: "Solid Wood Legs" },
      colors: ["Natural Oak", "Tan", "Light Brown"],
      assembly: "Partial (Legs only)",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Modern", "Natural"]
    },
    images: ["https://images.unsplash.com/photo-1631679893114-7957e44879db?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["tv-stand", "natural-oak", "6-drawers", "large-storage", "wood"],
    roomType: "Living Room"
  },
  {
    name: "Linear White TV Stand",
    description: "A long, bright white TV stand featuring three open display cubbies and a smooth cabinet base. Its minimalist design and light wood trim create a modern, high-end feel.",
    category: "Living Room",
    subcategory: "TV Units",
    price: 3199,
    costPrice: 2100,
    specifications: {
      dimensions: { length: 200, width: 40, height:45, weight: 35 },
      material: { primary: "Glossy White Composite", frame: "Natural Wood Base" },
      colors: ["White", "Light Tan"],
      assembly: "Partial (Legs only)",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Modern", "Natural"]
    },
    images: ["https://images.unsplash.com/photo-1586024486164-ce9b3d87e09f?q=80&w=978&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["white", "tv-unit", "modern", "large-storage", "minimalist"],
    roomType: "Living Room"
  },

  // LIVING ROOM - Armchairs
  {
    name: "Natural Oak Lounge Armchair",
    description: "Modern upholstered lounge chair with solid oak frame and padded armrests. Designed for comfort and style in contemporary living spaces.",
    category: "Living Room",
    subcategory: "Armchairs",
    price: 2299,
    costPrice: 1150,
    specifications: {
      dimensions: { length: 75, width: 80, height: 95, weight: 18 },
      material: { primary: "Corduroy Fabric", frame: "Solid Oak Wood", filling: "High-Density Foam" },
      seatingCapacity: 1,
      colors: ["Natural Oak"],
      assembly: "Minimal",
      assemblyTime: "5 minutes",
      spaceEfficient: true,
      style: ["Scandinavian", "Modern"]
    },
    images: ["https://images.unsplash.com/photo-1714872245785-674ae3038d21?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["armchair", "longe-chair", "oak","modern", "cozy"],
    roomType: "Living Room"
  },
  {
    name: "Cloud Comfort Accent Armchair",
    description: "Oversized round accent chair with plush cushioning and soft fabric upholstery. Designed for ultimate comfort and modern living spaces.",
    category: "Living Room",
    subcategory: "Armchairs",
    price: 3499,
    costPrice: 1750,
    specifications: {
      dimensions: { length: 85, width: 90, height: 100, weight: 28 },
      material: { primary: "Polyester Fabric", frame: "HardWood", filling: "High-resilience foam and fiber" },
      seatingCapacity: 1,
      colors: ["Light Grey"],
      assembly: "None",
      assemblyTime: "No assembly required",
      spaceEfficient: true,
      style: ["Modern"]
    },
    images: ["https://images.unsplash.com/photo-1759722667394-000072b59a3a?q=80&w=754&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["round-chair", "plush", "cozy", "comfortable"],
    roomType: "Living Room"
  },
  {
    name: "Cream Fuzzy Armchair",
    description: "A soft, cozy armchair with a thick fuzzy fabric. It has a rounded back and light wood legs with gold tips, making it a perfect spot for reading or relaxing.",
    category: "Living Room",
    subcategory: "Armchairs",
    price: 2299,
    costPrice: 1150,
    specifications: {
      dimensions: { length: 80, width: 75, height: 85, weight: 18 },
      material: { primary: "Fuzzy Polyester Fabric", frame: "Light Wood", filling: "Soft Foam" },
      seatingCapacity: 1,
      colors: ["Cream", "White", "Off-White"],
      assembly: "Easy (Legs only)",
      assemblyTime: "10 minutes",
      spaceEfficient: true,
      style: ["Cozy", "Modern"]
    },
    images: ["https://images.unsplash.com/photo-1739980153522-23e9fbca080b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["armchair", "cream", "fuzzy", "wood-legs", "cozy"],
    roomType: "Living Room"
  },

  // LIVING ROOM - Shelving
  {
    name: "Solid Wood Wall Bookshelf",
    description: "Full-wall modular shelving unit with multiple compartments for books, media, and décor. Designed for maximum storage with a clean, modern aesthetic.",
    category: "Living Room",
    subcategory: "Shelving",
    price: 1499,
    costPrice: 800,
    specifications: {
      dimensions: { length: 60, width: 40, height: 180, weight: 15 },
      material: { primary: "Solid Oak Wood", frame: "Oak Veneer" },
      colors: ["Natural Oak"],
      assembly: "Required",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Industrial", "Minimalist"]
    },
    images: ["https://images.unsplash.com/photo-1593589281510-c0de02549a96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["bookshelf", "wall-unit", "storage", "wood"],
    roomType: "Living Room"
  },

  // BEDROOM - Beds
  {
    name: "Cozy Wingback Bed",
    description: "A comfortable Queen-sized bed with a tall, padded headboard. The grey fabric and diamond button pattern make it look classic and simple.",
    category: "Bedroom",
    subcategory: "Beds",
    price: 6499,
    costPrice: 3000,
    specifications: {
      dimensions: { length: 220, width: 165, height: 140, weight: 65 },
      material: { primary: "Grey Fabric", frame: "Wood and Metal" },
      size: "Queen",
      colors: ["Grey", "Beige"],
      assembly: "Required",
      assemblyTime: "60 minutes",
      spaceEfficient: true,
      style: ["Classic", "Simple"]
    },
    images: ["https://images.unsplash.com/photo-1560184897-502a475f7a0d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["bed", "queen-size", "simple", "grey", "headboard"],
    roomType: "Bedroom"
  },
  {
    name: "Rustic Wood Platform Bed",
    description: "A sturdy Double-sized bed made from dark, natural wood. It has a simple flat headboard and a matching wooden frame that shows the real grain and texture of the wood.",
    category: "Bedroom",
    subcategory: "Beds",
    price: 4899,
    costPrice: 2250,
    specifications: {
      dimensions: { length: 215, width: 160, height: 110, weight: 70 },
      material: { primary: "Solid Pine Wood", frame: "Natural Wood" },
      colors: ["Dark Brown", "Natural Wood"],
      assembly: "Required",
      assemblyTime: "45 minutes",
      spaceEfficient: true,
      style: ["Rustic", "Simple", "Natural"]
    },
    images: ["https://images.unsplash.com/photo-1714837311766-eac4e92f284c?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["bed", "double-size", "wood", "dark-wood", "rustic"],
    roomType: "Bedroom"
  },
  {
    name: "Simple White Single Bed",
    description: "A basic, low-profile single bed with a clean white finish. Its small size and simple design make it perfect for kids' rooms or small guest spaces.",
    category: "Bedroom",
    subcategory: "Beds",
    price: 1499,
    costPrice: 650,
    specifications: {
      dimensions: { length: 190, width: 90, height: 35, weight: 25 },
      size: "Single",
      material: { primary: "White Wood Finish", frame: "Metal and Wood" },
      colors: ["White"],
      assembly: "Required",
      assemblyTime: "25 minutes",
      spaceEfficient: true,
      style: ["Modern", "Simple"]
    },
    images: ["https://images.unsplash.com/photo-1723468348798-e46f544fecbe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["bed", "single", "white"],
    roomType: "Bedroom"
  },


  // BEDROOM - Wardrobes
  {
    name: "Classic Wood Wardrobe",
    description: "A tall, two-door wooden wardrobe with two bottom drawers for extra storage. Its simple design and warm brown finish make it a great choice for keeping clothes organized.",
    category: "Bedroom",
    subcategory: "Wardrobes",
    price: 3999,
    costPrice: 2000,
    specifications: {
      dimensions: { length: 150, width: 60, height: 200, weight: 60 },
      material: { primary: "Oak Wood Finish", frame: "Solid Wood" },
      colors: ["Brown", "Tan", "Natural Wood"],
      assembly: "Required",
      assemblyTime: "60 minutes",
      spaceEfficient: true,
      style: ["Modern", "Simple"]
    },
    images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["wardrobe", "brown", "wood", "storage"],
    roomType: "Bedroom"
  },
  {
    name: "Bright White Storage Closet",
    description: "A tall, narrow white wardrobe with two doors and three drawers at the bottom. Its slim design and plain silver handles make it a simple and neat way to store clothes in small rooms.",
    category: "Bedroom",
    subcategory: "Wardrobes",
    price: 2999,
    costPrice: 1500,
    specifications: {
      dimensions: { length: 80, width: 50, height: 180, weight: 45},
      material: { primary: "White Painted Wood", frame: "Wood" },
      colors: ["White"],
      assembly: "Required",
      assemblyTime: "60 minutes",
      spaceEfficient: true,
      style: ["Modern", "Simple"]
    },
    images: ["https://images.unsplash.com/photo-1722605912844-7877b16f1ace?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["closet", "white", "storage"],
    roomType: "Bedroom"
  },

  // BEDROOM - Nightstands
  {
    name: "Modern Wood and White Nightstand",
    description: "A stylish bedside table with two dark wood drawers and a smooth white outer frame. Its clean lines and curved edges make it a great fit for a modern bedroom.",
    category: "Bedroom",
    subcategory: "Nightstands",
    price: 899,
    costPrice: 400,
    specifications: {
      dimensions: { length: 50, width: 40, height: 50, weight: 14 },
      material: { primary: "Walnut Wood Veneer", frame: "White Painted Wood" },
      colors: ["White","Dark Brown"],
      assembly: "Required",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Simple", "Classic"]
    },
    images: ["https://images.unsplash.com/photo-1649194271420-b2ff52418a62?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["nightstand", "white-and-wood", "2-drawers", "classic"],
    roomType: "Bedroom"
  },
  {
    name: "Natural Wood Tripod Stool",
    description: "A small, round side table made of light-colored wood. It has three thick legs and a smooth top, making it a simple and sturdy spot for a lamp or a book next to your bed.",
    category: "Bedroom",
    subcategory: "Nightstands",
    price: 599,
    costPrice: 300,
    specifications: {
      dimensions: { length: 35, width: 35, height: 45, weight: 4 },
      material: { primary: "Solid Pine Wood", frame: "Natural Wood" },
      colors: ["Natural", "Light Brown"],
      assembly: "None",
      assemblyTime: "0 minutes",
      spaceEfficient: true,
      style: ["Simple", "Natural"]
    },
    images: ["https://images.unsplash.com/photo-1648475235873-963ecc805ee0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["stool", "nightstand", "wood", "small", "round", "simple", "eco-friendly"],
    roomType: "Bedroom"
  },

  // BEDROOM - Dressers
  {
    name: "Natural Wood 9-Drawer Dresser",
    description: "A wide, light-colored dresser with a mix of wood and white drawer fronts. Its long surface and nine drawers provide lots of space for clothes and decor.",
    category: "Bedroom",
    subcategory: "Dressers",
    price: 5499,
    costPrice: 2750,
    specifications: {
      dimensions: { length: 160, width: 45, height: 85, weight: 52 },
      material: { primary: "Light Oak and Painted Wood", frame: "Solid Wood Legs" },
      colors: ["Light Brown", "White", "Tan" ],
      assembly: "Required",
      assemblyTime: "60 minutes",
      spaceEfficient: true,
      style: ["Modern", "Natural"]
    },
    images: ["https://images.unsplash.com/photo-1719035271030-c4f941639aaf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["dresser", "wood", "storage"],
    roomType: "Bedroom"
  },

  // OFFICE - Desks
  {
    name: "Adjustable Wood Standing Desk",
    description: "A large desk with a shiny dark wood top and strong black metal legs. You can change the height to work while sitting or standing, and it has wheels to move easily.",
    category: "Office",
    subcategory: "Desks",
    price: 3299,
    costPrice: 1500,
    specifications: {
      dimensions: { length: 150, width: 75, height: 70, weight: 35 },
      material: { primary: "Polished Wood", frame: "Black Steel with Wheels" },
      colors: ["Dark Brown", "Black"],
      assembly: "Required",
      assemblyTime: "30 minutes",
      spaceEfficient: true,
      style: ["Modern", "Simply"]
    },
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800"],
    tags: ["desk", "standing-desk", "wood", "office"],
    roomType: "Office"
  },
  {
    name: "Natural Wood Work Desk",
    description: "A spacious desk with a solid natural wood top and strong black metal frame. It has wheels for easy movement.",
    category: "Office",
    subcategory: "Desks",
    price: 2999,
    costPrice: 1250,
    specifications: {
      dimensions: { length: 160, width: 80, height: 72, weight: 40 },
      material: { primary: "Stolid Wood", frame: "Black Steel with Wheels" },
      colors: ["Black", "Natural Oak"],
      assembly: "Required",
      assemblyTime: "35 minutes",
      spaceEfficient: true,
      style: ["Industrial", "Modern"]
    },
    images: ["https://images.unsplash.com/photo-1683836810074-209ee2a9d353?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["desk", "wood", "workstation", "adjustable", "office"],
    roomType: "Office"
  },

  // OFFICE - Office Chairs
  {
    name: "Ergonomic Mesh Chair",
    description: "A comfortable office chair with breathable mesh back support, adjustable headrest, and padded seat. Designed to support good posture during long working hours.",
    category: "Office",
    subcategory: "Office Chairs",
    price: 1999,
    costPrice: 1200,
    specifications: {
      dimensions: { length: 65, width: 70, height: 120, weight: 18 },
      material: { primary: "Mesh", frame: "Reinforced Plastic & Steel Base", cushion: "High-Density Foam"},
      seatingCapacity: 1,
      colors: ["White", "Grey"],
      assembly: "Required",
      assemblyTime: "20 minutes",
      spaceEfficient: true,
      style: ["Ergonomic", "Modern"]
    },
    images: ["https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["office-chair", "ergonomic", "mesh", "black", "adjustable"],
    roomType: "Office"
  },
  {
    name: "Vintage Leather Office Chair",
    description: "A stylish swivel office chair with soft faux leather upholstery and a ribbed backrest. Features adjustable height and smooth-rolling wheels for everyday comfort.",
    category: "Office",
    subcategory: "Office Chairs",
    price: 2499,
    costPrice: 1650,
    specifications: {
      dimensions: { length: 60, width: 60, height: 90, weight: 14 },
      material: { primary: "Faux Leather", frame: "Plastic Base",cushion: "High-Density Foam" },
      seatingCapacity: 1,
      colors: ["Brown"],
      assembly: "Required",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Modern", "Vintage"]
    },
    images: ["https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?q=80&w=678&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["office-chair", "leather-chair", "brown"],
    roomType: "Office"
  },

  // OFFICE - Bookcases
  {
    name: "Mid-Century Modern Bookcase",
    description: "A tall, wooden display shelf featuring an asymmetrical cubby layout and sleek tapered legs, perfect for books, plants, and decor.",
    category: "Office",
    subcategory: "Bookcases",
    price: 1299,
    costPrice: 700,
    specifications: {
      dimensions: { length: 80, width: 30, height: 160, weight: 42 },
      material: { primary: "Walnut-Finished Wood", base: "Tapered Metal Legs" },
      colors: ["Warm Oak"],
      assembly: "Required",
      assemblyTime: "25 minutes",
      spaceEfficient: true,
      style: ["Mid-Century Modern"]
    },
    images: ["https://images.unsplash.com/photo-1708161885729-63faff807840?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["bookcase", "wood", "storage"],
    roomType: "Office"
  },
  {
    name: "Asymmetrical Oak Bookcase",
    description: "A unique mid-century inspired bookcase featuring a C-shaped silhouette with integrated book storage and stylish tapered dowel legs.",
    category: "Office",
    subcategory: "Bookcases",
    price: 799,
    costPrice: 400,
    specifications: {
      dimensions: { length: 45, width: 35, height: 65, weight: 12 },
      material: { primary: "Oak Veneer Wood", frame: "Oak" },
      colors: ["Natural Oak"],
      assembly: "Required",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Mid-Century Modern"]
    },
    images: ["https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"],
    tags: ["c-table", "wood", "storage"],
    roomType: "Office"
  },

  // DINING - Dining Tables
  {
    name: "Round Drop-Leaf Table",
    description: "Expandable round table. Fold down sides when not in use to save space.",
    category: "Dining",
    subcategory: "Dining Tables",
    price: 2499,
    costPrice: 1250,
    specifications: {
      dimensions: { length: 90, width: 90, height: 75, weight: 22 },
      material: { primary: "Solid Wood", frame: "Wood" },
      seatingCapacity: 4,
      colors: ["Natural Oak", "White", "Walnut"],
      assembly: "Minimal",
      assemblyTime: "15 minutes",
      spaceEfficient: true,
      style: ["Traditional", "Space-Saving"]
    },
    images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800"],
    tags: ["dining-table", "round", "drop-leaf", "expandable", "oak", "4-seater"],
    roomType: "Dining"
  },
  {
    name: "Narrow Dining Table",
    description: "Slim rectangular table perfect for apartments. Seats 4 comfortably.",
    category: "Dining",
    subcategory: "Dining Tables",
    price: 1999,
    costPrice: 1000,
    specifications: {
      dimensions: { length: 120, width: 60, height: 75, weight: 18 },
      material: { primary: "Pine Wood", frame: "Pine" },
      seatingCapacity: 4,
      colors: ["Natural", "White", "Grey"],
      assembly: "Required",
      assemblyTime: "30 minutes",
      spaceEfficient: true,
      style: ["Scandinavian", "Minimalist"]
    },
    images: ["https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800"],
    tags: ["dining-table", "narrow", "rectangular", "4-seater", "pine", "compact"],
    roomType: "Dining"
  },

  // DINING - Dining Chairs
  {
    name: "Stackable Dining Chairs (Set of 4)",
    description: "Space-saving stackable chairs. Modern design with cushioned seats.",
    category: "Dining",
    subcategory: "Dining Chairs",
    price: 1599,
    costPrice: 800,
    specifications: {
      dimensions: { length: 45, width: 50, height: 85, weight: 5 },
      material: { primary: "Plastic & Fabric", frame: "Metal Legs" },
      seatingCapacity: 1,
      colors: ["White", "Grey", "Black"],
      assembly: "Minimal",
      assemblyTime: "5 minutes per chair",
      spaceEfficient: true,
      style: ["Modern", "Minimalist"]
    },
    images: ["https://images.unsplash.com/photo-1503602642458-232111445657?w=800"],
    tags: ["dining-chairs", "stackable", "set-of-4", "white", "modern", "space-saving"],
    roomType: "Dining"
  },
  {
    name: "Folding Chairs (Set of 2)",
    description: "Foldable dining chairs for guests. Easy storage when not needed.",
    category: "Dining",
    subcategory: "Dining Chairs",
    price: 799,
    costPrice: 400,
    specifications: {
      dimensions: { length: 45, width: 48, height: 80, weight: 4 },
      material: { primary: "Metal", frame: "Steel Frame" },
      seatingCapacity: 1,
      colors: ["Black", "Silver", "White"],
      assembly: "None",
      assemblyTime: "0 minutes",
      spaceEfficient: true,
      style: ["Functional", "Minimalist"]
    },
    images: ["https://images.unsplash.com/photo-1586158291800-2665f07bba79?w=800"],
    tags: ["folding-chairs", "set-of-2", "guests", "black", "storage", "compact"],
    roomType: "Dining"
  },

  // STORAGE
  {
    name: "Shoe Cabinet with Seat",
    description: "Slim shoe storage with cushioned top for sitting. Holds up to 12 pairs.",
    category: "Storage",
    subcategory: "Cabinets",
    price: 1499,
    costPrice: 750,
    specifications: {
      dimensions: { length: 80, width: 30, height: 90, weight: 20 },
      material: { primary: "MDF", frame: "Wood" },
      colors: ["White", "Oak", "Grey"],
      assembly: "Required",
      assemblyTime: "40 minutes",
      spaceEfficient: true,
      style: ["Modern", "Functional"]
    },
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    tags: ["shoe-cabinet", "storage", "seat", "entryway", "white", "slim"],
    roomType: "Storage"
  },
  {
    name: "Vertical Storage Tower",
    description: "Tall narrow cabinet with multiple shelves. Perfect for bathrooms or closets.",
    category: "Storage",
    subcategory: "Cabinets",
    price: 1199,
    costPrice: 600,
    specifications: {
      dimensions: { length: 40, width: 30, height: 180, weight: 18 },
      material: { primary: "Bamboo", frame: "Bamboo" },
      colors: ["Natural Bamboo", "White"],
      assembly: "Required",
      assemblyTime: "35 minutes",
      spaceEfficient: true,
      style: ["Natural", "Minimalist"]
    },
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800"],
    tags: ["storage-tower", "vertical", "bamboo", "bathroom", "narrow", "shelves"],
    roomType: "Storage"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert categories
    await Category.insertMany(categories);
    console.log('✅ Categories added');

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@furniture.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@furniture.com',
        password: 'Admin123!',
        role: 'admin',
        profile: { name: 'Admin User' }
      });
      console.log('✅ Admin user created');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin: admin@furniture.com');
    console.log('🔑 Password: Admin123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();