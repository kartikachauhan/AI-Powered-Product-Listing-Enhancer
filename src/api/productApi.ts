import { ProductInput, AIGenerationResponse } from '@/types/product';

// Mock AI API for generating product descriptions
export const generateDescription = async (productData: ProductInput): Promise<AIGenerationResponse> => {
  // Simulate API delay (1-2 seconds)
  const delay = Math.random() * 1000 + 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Generate description based on product category and title
  const description = generateDescriptionByCategory(productData);
  const seoKeywords = generateSEOKeywords(productData);
  
  return {
    description,
    meta: {
      seoKeywords,
      language: 'en'
    }
  };
};

// Generate descriptions based on product category
const generateDescriptionByCategory = (product: ProductInput): string => {
  const { title, category } = product;
  
  const descriptions = {
    'Electronics': [
      `Experience cutting-edge technology with the ${title}. This premium electronic device combines innovation with reliability, perfect for tech enthusiasts and professionals alike. Features advanced functionality and sleek design for modern lifestyles.`,
      `Discover the future of electronics with the ${title}. Packed with advanced features and sophisticated engineering, it delivers exceptional performance and user experience. Built to last with premium materials and cutting-edge technology.`,
      `Upgrade your tech game with the ${title}. This high-performance electronic device offers seamless integration, intuitive controls, and stunning visuals. Perfect for both work and entertainment needs.`
    ],
    'Clothing': [
      `Elevate your style with the ${title}. Crafted from premium materials with meticulous attention to detail, this piece offers both comfort and sophistication. Designed for the modern individual who values quality and fashion.`,
      `Make a statement with the ${title}. This carefully designed garment combines contemporary aesthetics with practical functionality. Perfect for various occasions, from casual outings to formal events.`,
      `Experience luxury and comfort with the ${title}. Made from high-quality fabrics and featuring expert craftsmanship, this piece ensures you look and feel your best in any setting.`
    ],
    'Home & Garden': [
      `Transform your space with the ${title}. This carefully crafted item brings beauty and functionality to your home, creating an environment you'll love spending time in. Perfect for enhancing any room's aesthetic.`,
      `Enhance your living space with the ${title}. Combining aesthetic appeal with practical design, it's the perfect addition to create a warm and inviting atmosphere in your home.`,
      `Create the home of your dreams with the ${title}. This versatile piece offers both style and substance, making it easy to achieve the perfect balance of form and function in your space.`
    ],
    'Sports & Outdoors': [
      `Take your performance to the next level with the ${title}. Designed for athletes and outdoor enthusiasts, this equipment combines durability with cutting-edge technology for optimal results.`,
      `Conquer the outdoors with the ${title}. Built to withstand the elements while providing superior performance, this gear ensures you can focus on your adventure without worrying about equipment failure.`,
      `Achieve your fitness goals with the ${title}. This professional-grade equipment offers precision engineering and ergonomic design for maximum effectiveness and comfort during your workouts.`
    ],
    'Books & Media': [
      `Immerse yourself in the world of the ${title}. This captivating piece offers hours of entertainment and education, perfect for expanding your knowledge and imagination.`,
      `Discover new perspectives with the ${title}. Carefully curated content that challenges your thinking and broadens your horizons, making it an essential addition to your collection.`,
      `Experience the magic of storytelling with the ${title}. This engaging content delivers compelling narratives and valuable insights that will keep you entertained and informed.`
    ],
    'Beauty & Health': [
      `Enhance your natural beauty with the ${title}. This premium product combines science-backed ingredients with luxurious formulations for visible results and indulgent self-care experiences.`,
      `Prioritize your wellness with the ${title}. Formulated with care and expertise, this health and beauty solution supports your journey to looking and feeling your absolute best.`,
      `Transform your routine with the ${title}. This innovative product delivers professional-quality results at home, making it easy to maintain your beauty and health goals.`
    ],
    'Toys & Games': [
      `Spark imagination and creativity with the ${title}. This engaging toy or game provides hours of entertainment while supporting developmental skills and family bonding time.`,
      `Create lasting memories with the ${title}. Perfect for children and families, this interactive item offers fun, learning, and quality time together in one engaging package.`,
      `Unleash endless possibilities with the ${title}. This versatile toy or game adapts to different ages and skill levels, ensuring years of enjoyment and educational value.`
    ],
    'Automotive': [
      `Upgrade your vehicle with the ${title}. This premium automotive accessory or part combines precision engineering with durability, ensuring optimal performance and long-lasting reliability.`,
      `Enhance your driving experience with the ${title}. Designed for automotive enthusiasts and professionals, this product delivers superior quality and performance for your vehicle.`,
      `Protect and improve your car with the ${title}. This essential automotive product offers the perfect balance of functionality, style, and protection for your valuable investment.`
    ],
    'Food & Beverages': [
      `Savor the exceptional taste of the ${title}. This premium food or beverage product offers authentic flavors and high-quality ingredients for an unforgettable culinary experience.`,
      `Discover new flavors with the ${title}. Carefully crafted using traditional methods and premium ingredients, this product delivers taste and quality that exceeds expectations.`,
      `Elevate your dining experience with the ${title}. This gourmet selection combines exceptional taste with premium quality, making every meal a special occasion.`
    ],
    'Other': [
      `Experience exceptional quality with the ${title}. This versatile product offers reliable performance and thoughtful design for various applications and needs.`,
      `Discover innovation with the ${title}. This unique item combines creativity with functionality, providing solutions that enhance your daily life and activities.`,
      `Upgrade your essentials with the ${title}. This carefully designed product offers the perfect balance of style, function, and value for discerning customers.`
    ]
  };

  const categoryDescriptions = descriptions[category as keyof typeof descriptions] || descriptions['Other'];
  const randomIndex = Math.floor(Math.random() * categoryDescriptions.length);
  
  return categoryDescriptions[randomIndex] || '';
};

// Generate SEO keywords based on product data
const generateSEOKeywords = (product: ProductInput): string[] => {
  const { title, category, price } = product;
  
  const baseKeywords = [
    title.toLowerCase(),
    category.toLowerCase(),
    'premium quality',
    'best value',
    'top rated'
  ];

  // Add category-specific keywords
  const categoryKeywords = {
    'Electronics': ['tech', 'gadget', 'electronic device', 'smart technology'],
    'Clothing': ['fashion', 'apparel', 'style', 'clothing'],
    'Home & Garden': ['home decor', 'garden', 'household', 'interior'],
    'Sports & Outdoors': ['sports', 'outdoor', 'fitness', 'athletic'],
    'Books & Media': ['book', 'media', 'entertainment', 'education'],
    'Beauty & Health': ['beauty', 'health', 'wellness', 'self-care'],
    'Toys & Games': ['toy', 'game', 'entertainment', 'children'],
    'Automotive': ['car', 'automotive', 'vehicle', 'auto'],
    'Food & Beverages': ['food', 'beverage', 'gourmet', 'culinary'],
    'Other': ['product', 'item', 'accessory', 'essential']
  };

  const specificKeywords = categoryKeywords[category as keyof typeof categoryKeywords] || categoryKeywords['Other'];
  
  // Add price-based keywords
  const priceKeywords = price < 50 ? ['budget friendly', 'affordable'] : 
                       price < 200 ? ['mid-range', 'value'] : 
                       ['premium', 'luxury', 'high-end'];

  return [...baseKeywords, ...specificKeywords, ...priceKeywords];
};
