const Product = require('../models/Product');
const language = require('@google-cloud/language');

const nlpClient = new language.LanguageServiceClient({
  apiKey: process.env.GOOGLE_NLP_API_KEY
});

console.log('🔑 Google NLP API:', process.env.GOOGLE_NLP_API_KEY ? 'Configured ✅' : 'Not configured ❌');

// @GET /api/products
const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      style,
      color,
      spaceEfficient,
      sortBy,
      roomType
    } = req.query;

    // Build filter
    let filter = { inStock: true };

    if (category) filter.category = category;
    if (roomType) filter.roomType = roomType;
    if (spaceEfficient === 'true') filter['specifications.spaceEfficient'] = true;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (style) {
      filter['specifications.style'] = { $in: [style] };
    }

    if (color) {
      filter['specifications.colors'] = {
        $in: [new RegExp(color, 'i')]
      };
    }

    if (search) {
      // Improved text search with better matching
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } },
        { 'specifications.material.primary': { $regex: search, $options: 'i' } },
        { 'specifications.style': { $elemMatch: { $regex: search, $options: 'i' } } },
        { 'specifications.colors': { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }
    // Sort options
    let sort = {};
    if (sortBy === 'price-low') sort.price = 1;
    else if (sortBy === 'price-high') sort.price = -1;
    else if (sortBy === 'popular') sort.salesCount = -1;
    else if (sortBy === 'newest') sort.createdAt = -1;
    else if (sortBy === 'most-viewed') sort.views = -1;
    else sort.createdAt = -1;

    const products = await Product.find(filter).sort(sort);

    res.json({
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment views
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/featured/top-selling
const getTopSelling = async (req, res) => {
  try {
    const products = await Product.find({ inStock: true })
      .sort({ salesCount: -1 })
      .limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/featured/on-sale
const getOnSale = async (req, res) => {
  try {
    const products = await Product.find({
      inStock: true,
      discount: { $gt: 0 }
    }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @GET /api/products/:id/similar
const getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const similar = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ],
      inStock: true
    }).limit(4);

    res.json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @POST /api/products/ai-search
const aiSearch = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    console.log('🤖 AI Search prompt:', prompt);

    let analysis = {
      furnitureTypes: [],
      colors: [],
      maxPrice: null,
      category: null,
      styles: [],
      spaceEfficient: false
    };

    // Try Google Cloud Natural Language API
    if (process.env.GOOGLE_NLP_API_KEY) {
      try {
        console.log('🔮 Using Google Cloud NLP API...');

        const document = {
          content: prompt,
          type: 'PLAIN_TEXT',
        };

        // Analyze entities
        const [result] = await nlpClient.analyzeEntities({ document });
        const entities = result.entities;

        console.log('📊 Detected entities:', entities.map(e => ({ 
          name: e.name, 
          type: e.type 
        })));

        // Extract furniture types and colors from entities
        entities.forEach(entity => {
          const name = entity.name.toLowerCase();
          
          // Furniture types
          const furnitureTypes = ['sofa', 'couch', 'chair', 'table', 'desk', 'bed', 
                                 'cabinet', 'shelf', 'dresser', 'wardrobe', 'nightstand',
                                 'armchair', 'loveseat', 'sectional', 'bookcase'];
          
          furnitureTypes.forEach(type => {
            if (name.includes(type) && !analysis.furnitureTypes.includes(type)) {
              analysis.furnitureTypes.push(type);
            }
          });

          // Colors
          const colors = ['grey', 'gray', 'beige', 'white', 'black', 'blue', 'navy',
                         'green', 'brown', 'pink', 'red', 'yellow', 'charcoal', 'cream',
                         'sage', 'mustard', 'terracotta'];
          
          colors.forEach(color => {
            if (name.includes(color) && !analysis.colors.includes(color)) {
              analysis.colors.push(color);
            }
          });

          // Styles
          const styles = ['modern', 'minimalist', 'scandinavian', 'industrial',
                         'contemporary', 'traditional', 'rustic', 'vintage'];
          
          styles.forEach(style => {
            if (name.includes(style) && !analysis.styles.includes(style)) {
              analysis.styles.push(style);
            }
          });
        });

        // Extract price using regex
        const priceMatch = prompt.match(/R?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g);
        if (priceMatch) {
          const prices = priceMatch.map(p => Number(p.replace(/[R,\s]/g, '')));
          analysis.maxPrice = Math.max(...prices);
          console.log('💰 Detected max price:', analysis.maxPrice);
        }

        const colorList = ['grey', 'gray', 'beige', 'white', 'black', 'blue', 'navy','green', 'brown', 'pink', 'red', 'yellow', 'charcoal', 'cream','sage', 'mustard', 'terracotta'];
        const lowerPrompt = prompt.toLowerCase();
        colorList.forEach(color => {
          if (lowerPrompt.includes(color) && !analysis.colors.includes(color)) {
            analysis.colors.push(color);
          }
        });
        
        if (analysis.colors.length > 0) {
          console.log('🎨 Detected colors:', analysis.colors);
        }

        // Detect space-efficient need
        if (lowerPrompt.includes('small') || lowerPrompt.includes('compact') ||
            lowerPrompt.includes('studio') || lowerPrompt.includes('apartment') ||
            lowerPrompt.includes('tiny') || lowerPrompt.includes('space')) {
          analysis.spaceEfficient = true;
        }

        console.log('✅ Google NLP Analysis:', analysis);

      } catch (nlpError) {
        console.error('⚠️  Google NLP error:', nlpError.message);
        console.log('📉 Falling back to pattern matching...');
        // Fall through to pattern matching
      }
    } else {
      console.log('📉 No NLP API key - using pattern matching');
    }

    // Fallback pattern matching if NLP didn't find anything
    if (analysis.furnitureTypes.length === 0) {
      console.log('📉 Using pattern matching fallback...');
      
      const lowerPrompt = prompt.toLowerCase();
      
      // Extract furniture types
      const furniturePatterns = {
        'sofa': ['sofa', 'couch'],
        'loveseat': ['loveseat'],
        'sectional': ['sectional'],
        'chair': ['chair', 'armchair', 'recliner'],
        'table': ['table', 'coffee table', 'dining table', 'side table'],
        'desk': ['desk'],
        'bed': ['bed'],
        'dresser': ['dresser', 'drawer'],
        'cabinet': ['cabinet'],
        'shelf': ['shelf', 'bookcase', 'bookshelf']
      };

      for (const [type, patterns] of Object.entries(furniturePatterns)) {
        if (patterns.some(p => lowerPrompt.includes(p))) {
          if (!analysis.furnitureTypes.includes(type)) {
            analysis.furnitureTypes.push(type);
          }
        }
      }

      // Extract colors
      const colorList = ['grey', 'gray', 'beige', 'white', 'black', 'blue', 'navy',
                        'green', 'brown', 'pink', 'red', 'yellow', 'charcoal', 'cream'];
      
      colorList.forEach(color => {
        if (lowerPrompt.includes(color) && !analysis.colors.includes(color)) {
          analysis.colors.push(color);
        }
      });

      // Price
      if (!analysis.maxPrice) {
        const priceMatch = prompt.match(/R?\s*(\d+(?:,\d{3})*)/g);
        if (priceMatch) {
          const prices = priceMatch.map(p => Number(p.replace(/[R,\s]/g, '')));
          analysis.maxPrice = Math.max(...prices);
        }
      }
    }

    console.log('🎯 Final Analysis:', analysis);

    // Build MongoDB filter
    let filter = { inStock: true };

    if (analysis.maxPrice) {
      filter.price = { $lte: analysis.maxPrice };
    }

    if (analysis.category) {
      filter.category = analysis.category;
    }

    if (analysis.spaceEfficient) {
      filter['specifications.spaceEfficient'] = true;
    }

    if (analysis.colors.length > 0) {
      filter['specifications.colors'] = { 
        $in: analysis.colors.map(c => new RegExp(c, 'i'))
      };
      console.log('🎨 Color filter:', analysis.colors);
    }

    // Furniture type search
    if (analysis.furnitureTypes.length > 0) {
      filter.$or = analysis.furnitureTypes.map(type => ({
        $or: [
          { name: { $regex: type, $options: 'i' } },
          { description: { $regex: type, $options: 'i' } },
          { subcategory: { $regex: type, $options: 'i' } },
          { tags: { $elemMatch: { $regex: type, $options: 'i' } } }
        ]
      }));
    }

    console.log('🔎 MongoDB filter:', JSON.stringify(filter, null, 2));

    // Get products
    let products = await Product.find(filter).limit(50);

    console.log('📦 Found', products.length, 'products');

    // Score products
    const scoredProducts = products.map(product => {
      let score = 0;
      const productName = product.name.toLowerCase();
      const productDesc = product.description.toLowerCase();

      // Furniture type scoring
      analysis.furnitureTypes.forEach(type => {
        if (productName.includes(type)) score += 20;
        if (productDesc.includes(type)) score += 10;
      });

      // Color scoring
      if (product.specifications?.colors && analysis.colors.length > 0) {
        analysis.colors.forEach(color => {
          const hasColor = product.specifications.colors.some(c => 
            c.toLowerCase().includes(color)
          );
          if (hasColor) score += 15;
        });
      }

      // Style scoring
      if (product.specifications?.style && analysis.styles.length > 0) {
        analysis.styles.forEach(style => {
          const hasStyle = product.specifications.style.some(s => 
            s.toLowerCase().includes(style)
          );
          if (hasStyle) score += 10;
        });
      }

      // Category bonus
      if (analysis.category && product.category === analysis.category) {
        score += 15;
      }

      return { ...product.toObject(), relevanceScore: score };
    });

    scoredProducts.sort((a, b) => b.relevanceScore - a.relevanceScore);
    // Return products - don't filter by score since we already have relevant results
    const finalProducts = scoredProducts.slice(0, 20);

    console.log('✅ Returning', finalProducts.length, 'products');
    console.log('📊 Top 3:', finalProducts.slice(0, 3).map(p => ({ 
      name: p.name, 
      score: p.relevanceScore 
    })));

    res.json({
      prompt,
      extractedCriteria: analysis,
      count: finalProducts.length,
      products: finalProducts,
      poweredBy: process.env.GOOGLE_NLP_API_KEY ? 'Google Cloud NLP' : 'Pattern Matching'
    });

  } catch (error) {
    console.error('❌ AI Search error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getTopSelling,
  getOnSale,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  aiSearch
};