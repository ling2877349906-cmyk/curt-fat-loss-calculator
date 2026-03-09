/**
 * 食物营养数据库
 * 数据来源：中国食物成分表 / 运动营养学参考
 * 每100g食材的营养素含量
 */
var foodDatabase = {
  // ========== 主食/谷物 ==========
  '米饭': { calories: 116, carbs: 25.9, protein: 2.6, fat: 0.3 },
  '白米饭': { calories: 116, carbs: 25.9, protein: 2.6, fat: 0.3 },
  '糙米饭': { calories: 111, carbs: 23.5, protein: 2.6, fat: 0.9 },
  '馒头': { calories: 221, carbs: 44.2, protein: 7.0, fat: 1.1 },
  '面条': { calories: 110, carbs: 21.6, protein: 3.4, fat: 0.5 },
  '全麦面包': { calories: 246, carbs: 41.3, protein: 8.5, fat: 3.5 },
  '白面包': { calories: 266, carbs: 49.1, protein: 8.4, fat: 3.3 },
  '燕麦': { calories: 367, carbs: 61.6, protein: 13.5, fat: 6.7 },
  '燕麦片': { calories: 367, carbs: 61.6, protein: 13.5, fat: 6.7 },
  '红薯': { calories: 86, carbs: 20.1, protein: 1.6, fat: 0.1 },
  '紫薯': { calories: 82, carbs: 18.7, protein: 1.3, fat: 0.2 },
  '土豆': { calories: 77, carbs: 17.5, protein: 2.0, fat: 0.1 },
  '玉米': { calories: 86, carbs: 19.0, protein: 3.2, fat: 1.2 },
  '小米': { calories: 358, carbs: 73.5, protein: 9.0, fat: 3.1 },
  '意面': { calories: 131, carbs: 25.5, protein: 5.0, fat: 0.9 },
  '年糕': { calories: 154, carbs: 34.7, protein: 3.3, fat: 0.6 },
  '粉丝': { calories: 338, carbs: 83.7, protein: 0.5, fat: 0.2 },
  '荞麦面': { calories: 340, carbs: 70.2, protein: 10.6, fat: 2.5 },

  // ========== 肉类 ==========
  '鸡胸肉': { calories: 133, carbs: 0, protein: 31.0, fat: 1.2 },
  '鸡胸': { calories: 133, carbs: 0, protein: 31.0, fat: 1.2 },
  '鸡腿肉': { calories: 181, carbs: 0, protein: 20.2, fat: 10.9 },
  '鸡翅': { calories: 194, carbs: 0, protein: 17.4, fat: 13.6 },
  '鸡蛋': { calories: 144, carbs: 1.5, protein: 13.3, fat: 8.8 },
  '蛋白': { calories: 52, carbs: 0.7, protein: 11.0, fat: 0.2 },
  '蛋黄': { calories: 328, carbs: 3.6, protein: 15.2, fat: 27.0 },
  '牛肉': { calories: 125, carbs: 0, protein: 19.9, fat: 4.2 },
  '牛排': { calories: 190, carbs: 0, protein: 22.0, fat: 11.0 },
  '瘦牛肉': { calories: 106, carbs: 0, protein: 20.2, fat: 2.3 },
  '猪肉': { calories: 143, carbs: 0, protein: 20.3, fat: 6.2 },
  '瘦猪肉': { calories: 143, carbs: 0, protein: 20.3, fat: 6.2 },
  '猪里脊': { calories: 155, carbs: 0, protein: 20.2, fat: 7.9 },
  '五花肉': { calories: 395, carbs: 0, protein: 14.0, fat: 37.0 },
  '羊肉': { calories: 203, carbs: 0, protein: 19.0, fat: 14.1 },
  '鸭肉': { calories: 240, carbs: 0, protein: 15.5, fat: 19.7 },

  // ========== 海鲜/鱼类 ==========
  '三文鱼': { calories: 139, carbs: 0, protein: 21.3, fat: 5.6 },
  '金枪鱼': { calories: 132, carbs: 0, protein: 28.3, fat: 1.3 },
  '鳕鱼': { calories: 82, carbs: 0, protein: 17.8, fat: 0.7 },
  '虾': { calories: 87, carbs: 0, protein: 18.6, fat: 0.8 },
  '虾仁': { calories: 87, carbs: 0, protein: 18.6, fat: 0.8 },
  '鲈鱼': { calories: 105, carbs: 0, protein: 18.6, fat: 3.4 },
  '带鱼': { calories: 127, carbs: 0, protein: 17.7, fat: 4.9 },
  '鲫鱼': { calories: 108, carbs: 0, protein: 17.1, fat: 2.7 },
  '草鱼': { calories: 113, carbs: 0, protein: 16.6, fat: 5.2 },
  '螃蟹': { calories: 95, carbs: 0, protein: 13.8, fat: 2.3 },
  '鱿鱼': { calories: 92, carbs: 3.2, protein: 17.0, fat: 0.8 },

  // ========== 蔬菜 ==========
  '西兰花': { calories: 34, carbs: 4.3, protein: 4.1, fat: 0.6 },
  '菠菜': { calories: 24, carbs: 3.6, protein: 2.6, fat: 0.3 },
  '生菜': { calories: 13, carbs: 1.3, protein: 1.3, fat: 0.3 },
  '黄瓜': { calories: 15, carbs: 2.9, protein: 0.8, fat: 0.2 },
  '番茄': { calories: 19, carbs: 4.0, protein: 0.9, fat: 0.2 },
  '西红柿': { calories: 19, carbs: 4.0, protein: 0.9, fat: 0.2 },
  '胡萝卜': { calories: 37, carbs: 8.1, protein: 1.0, fat: 0.2 },
  '芹菜': { calories: 14, carbs: 1.9, protein: 0.8, fat: 0.1 },
  '白菜': { calories: 17, carbs: 3.1, protein: 1.5, fat: 0.2 },
  '大白菜': { calories: 17, carbs: 3.1, protein: 1.5, fat: 0.2 },
  '青椒': { calories: 22, carbs: 4.7, protein: 1.0, fat: 0.2 },
  '茄子': { calories: 21, carbs: 4.6, protein: 1.1, fat: 0.1 },
  '豆角': { calories: 31, carbs: 5.7, protein: 2.5, fat: 0.2 },
  '南瓜': { calories: 22, carbs: 4.5, protein: 0.7, fat: 0.1 },
  '冬瓜': { calories: 11, carbs: 2.4, protein: 0.4, fat: 0.2 },
  '蘑菇': { calories: 20, carbs: 1.9, protein: 2.7, fat: 0.1 },
  '香菇': { calories: 26, carbs: 5.2, protein: 2.2, fat: 0.3 },
  '木耳': { calories: 21, carbs: 3.4, protein: 1.5, fat: 0.2 },
  '洋葱': { calories: 39, carbs: 8.1, protein: 1.1, fat: 0.2 },
  '莴笋': { calories: 14, carbs: 2.2, protein: 1.0, fat: 0.1 },
  '油菜': { calories: 14, carbs: 2.0, protein: 1.8, fat: 0.5 },
  '豌豆': { calories: 111, carbs: 21.2, protein: 7.4, fat: 0.3 },
  '毛豆': { calories: 131, carbs: 10.1, protein: 13.1, fat: 5.0 },

  // ========== 豆制品 ==========
  '豆腐': { calories: 81, carbs: 4.2, protein: 8.1, fat: 3.7 },
  '嫩豆腐': { calories: 62, carbs: 2.9, protein: 6.2, fat: 2.6 },
  '豆浆': { calories: 31, carbs: 1.2, protein: 2.9, fat: 1.6 },
  '豆干': { calories: 140, carbs: 4.9, protein: 16.2, fat: 5.0 },
  '腐竹': { calories: 459, carbs: 22.3, protein: 44.6, fat: 21.7 },

  // ========== 水果 ==========
  '苹果': { calories: 53, carbs: 13.5, protein: 0.2, fat: 0.2 },
  '香蕉': { calories: 93, carbs: 22.0, protein: 1.4, fat: 0.2 },
  '橙子': { calories: 47, carbs: 11.1, protein: 0.8, fat: 0.2 },
  '葡萄': { calories: 44, carbs: 10.3, protein: 0.5, fat: 0.2 },
  '草莓': { calories: 30, carbs: 7.1, protein: 1.0, fat: 0.2 },
  '蓝莓': { calories: 57, carbs: 14.5, protein: 0.7, fat: 0.3 },
  '猕猴桃': { calories: 56, carbs: 14.5, protein: 0.8, fat: 0.6 },
  '西瓜': { calories: 25, carbs: 5.8, protein: 0.5, fat: 0.1 },
  '芒果': { calories: 35, carbs: 8.3, protein: 0.6, fat: 0.2 },
  '梨': { calories: 44, carbs: 10.7, protein: 0.4, fat: 0.2 },
  '桃子': { calories: 42, carbs: 10.9, protein: 0.8, fat: 0.1 },
  '樱桃': { calories: 46, carbs: 10.2, protein: 1.1, fat: 0.2 },
  '火龙果': { calories: 51, carbs: 13.3, protein: 1.1, fat: 0.2 },
  '柚子': { calories: 42, carbs: 9.5, protein: 0.8, fat: 0.2 },

  // ========== 乳制品 ==========
  '牛奶': { calories: 54, carbs: 3.4, protein: 3.0, fat: 3.2 },
  '脱脂牛奶': { calories: 33, carbs: 4.9, protein: 3.3, fat: 0.1 },
  '酸奶': { calories: 72, carbs: 9.3, protein: 3.1, fat: 2.7 },
  '希腊酸奶': { calories: 97, carbs: 3.6, protein: 9.0, fat: 5.0 },
  '奶酪': { calories: 328, carbs: 3.5, protein: 20.0, fat: 26.0 },

  // ========== 坚果/油脂 ==========
  '花生': { calories: 567, carbs: 21.7, protein: 24.8, fat: 44.3 },
  '核桃': { calories: 654, carbs: 13.7, protein: 15.2, fat: 65.2 },
  '杏仁': { calories: 578, carbs: 19.7, protein: 22.0, fat: 49.4 },
  '腰果': { calories: 559, carbs: 32.7, protein: 17.0, fat: 40.6 },
  '芝麻': { calories: 578, carbs: 24.0, protein: 19.1, fat: 46.1 },
  '橄榄油': { calories: 899, carbs: 0, protein: 0, fat: 99.9 },
  '花生酱': { calories: 600, carbs: 20.4, protein: 25.3, fat: 44.8 },

  // ========== 其他常见食材 ==========
  '蜂蜜': { calories: 321, carbs: 75.6, protein: 0.4, fat: 1.9 },
  '红枣': { calories: 264, carbs: 67.8, protein: 3.2, fat: 0.5 },
  '枸杞': { calories: 258, carbs: 64.1, protein: 13.9, fat: 1.5 },
  '蛋白粉': { calories: 375, carbs: 4.0, protein: 80.0, fat: 3.0 },
  '乳清蛋白': { calories: 375, carbs: 4.0, protein: 80.0, fat: 3.0 },
  '白糖': { calories: 400, carbs: 99.9, protein: 0, fat: 0 },
  '食用油': { calories: 899, carbs: 0, protein: 0, fat: 99.9 },
};

/**
 * 根据食材名称和克数计算营养素
 * @param {string} foodName - 食材名称
 * @param {number} grams - 克数
 * @returns {object|null} - { carbs, protein, fat, calories, found }
 */
function calculateNutrition(foodName, grams) {
  if (!foodName || !grams || grams <= 0) {
    return null;
  }

  var name = foodName.trim();
  var data = foodDatabase[name];

  if (!data) {
    // 尝试模糊匹配
    var keys = Object.keys(foodDatabase);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(name) !== -1 || name.indexOf(keys[i]) !== -1) {
        data = foodDatabase[keys[i]];
        break;
      }
    }
  }

  if (!data) {
    return { carbs: 0, protein: 0, fat: 0, calories: 0, found: false };
  }

  var ratio = grams / 100;
  return {
    carbs: Math.round(data.carbs * ratio * 10) / 10,
    protein: Math.round(data.protein * ratio * 10) / 10,
    fat: Math.round(data.fat * ratio * 10) / 10,
    calories: Math.round(data.calories * ratio),
    found: true
  };
}

module.exports = {
  foodDatabase: foodDatabase,
  calculateNutrition: calculateNutrition
};
