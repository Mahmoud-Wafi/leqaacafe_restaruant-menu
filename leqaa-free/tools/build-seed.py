# Builds public/seed-menu.json from the printed menus (restaurant + cafe).
# Run:  python3 tools/build-seed.py
import json, os
n = [0]
def nid(p):
    n[0] += 1
    return p + format(n[0], 'x')

def item(ar, en, prices, badge=''):
    # prices: a number, or a list of (label_ar, label_en, price)
    if isinstance(prices, (int, float)):
        pl = [{'label': {'ar': '', 'en': ''}, 'price': prices}]
    else:
        pl = [{'label': {'ar': a, 'en': e}, 'price': v} for a, e, v in prices]
    return {'id': nid('i'), 'name': {'ar': ar, 'en': en}, 'desc': {'ar': '', 'en': ''},
            'image': '', 'prices': pl, 'badge': badge, 'available': True, 'visible': True}

def cat(section, ar, en, items):
    return {'id': nid('c'), 'section': section, 'name': {'ar': ar, 'en': en}, 'visible': True, 'items': items}

R, C = 'restaurant', 'cafe'
def two(la, le, lb, lbe, rows):
    # rows: (ar, en, a, b)
    return [item(ar, en, [(la, le, a), (lb, lbe, b)]) for ar, en, a, b in rows]

crepe = two('عادي', 'Regular', 'كونو', 'Cone', [
    ('لحوم', 'Beef', 110, 130), ('ميكس فراخ', 'Mixed Chicken', 110, 130), ('زنجر', 'Zinger', 100, 120),
    ('شاورما', 'Shawarma', 100, 120), ('كرسبي', 'Crispy', 100, 120), ('فاهيتا', 'Fajita', 110, 120),
    ('سجق', 'Sausage', 100, 120), ('بسطرمة', 'Pastrami', 110, 130), ('لحم مفروم', 'Minced Beef', 100, 120),
    ('جمبري', 'Shrimp', 140, 160), ('شيش', 'Shish', 100, 120), ('كفتة', 'Kofta', 100, 120)])
crepe.append(item('سوبر كونز', 'Super Cones', [('كونو', 'Cone', 200)]))

pizza = two('وسط', 'Medium', 'كبير', 'Large', [
    ('مارجريتا', 'Margherita', 120, 150), ('ميكس جبن', 'Mixed Cheese', 140, 160), ('كرسبي', 'Crispy', 130, 150),
    ('سجق', 'Sausage', 130, 150), ('لحمة مفرومة', 'Minced Beef', 130, 150), ('بسطرمة', 'Pastrami', 140, 170),
    ('لحوم', 'Beef', 150, 200), ('شاورما', 'Shawarma', 130, 160), ('تشيكن رانش', 'Chicken Ranch', 140, 170),
    ('تشيكن باربكيو', 'Chicken BBQ', 140, 170), ('جمبري', 'Shrimp', 200, 250), ('سي فود', 'Seafood', 250, 300)])

pies = two('إسكندراني', 'Alexandrian', 'شرقي', 'Sharqi', [
    ('ميكس جبن', 'Mixed Cheese', 160, 180), ('ميكس لحوم', 'Mixed Meat', 200, 220), ('بسطرمة', 'Pastrami', 200, 220),
    ('كرسبي', 'Crispy', 200, 220), ('سجق', 'Sausage', 190, 210), ('لحمة', 'Beef', 190, 210),
    ('شاورما', 'Shawarma', 190, 210), ('تشيكن', 'Chicken', 190, 210), ('جمبري', 'Shrimp', 250, 270),
    ('سي فود', 'Seafood', 300, 320), ('لقاء', 'Leqaa Special', 300, 320)])

syrian = two('وسط', 'Medium', 'كبير', 'Large', [
    ('شاورما', 'Shawarma', 70, 90), ('تشيكن كرسبي', 'Chicken Crispy', 70, 90), ('بطاطس', 'Fries', 25, 35),
    ('كبدة', 'Liver', 35, 45), ('سجق', 'Sausage', 70, 80), ('كفتة', 'Kofta', 70, 80),
    ('فاهيتا', 'Fajita', 75, 90), ('جمبري', 'Shrimp', 90, 110), ('شيش', 'Shish', 80, 90),
    ('بطاطس موتزريلا', 'Mozzarella Fries', 35, 45)])

burger = two('سنجل', 'Single', 'دبل', 'Double', [
    ('كلاسيك', 'Classic', 80, 140), ('تشيز', 'Cheese', 90, 150), ('ستيك مشوي', 'Grilled Steak', 90, 150),
    ('فاير', 'Fire', 100, 160), ('ميجا', 'Mega', 100, 160), ('تشيكن تشيز', 'Chicken Cheese', 90, 150),
    ('تشيكن ماشروم', 'Chicken Mushroom', 90, 150), ('تشيكن فيليه', 'Chicken Fillet', 90, 150),
    ('تشيكن بولو', 'Chicken Polo', 100, 160), ('فرايد بافلو', 'Fried Buffalo', 100, 150),
    ('فرايد برجر', 'Fried Burger', 120, 170)])

def flat(rows):
    return [item(a, e, p) for a, e, p in rows]

categories = [
    cat(R, 'الكريب', 'Crepe', crepe),
    cat(R, 'الكريب الحلو', 'Sweet Crepe', flat([('نوتيلا', 'Nutella', 70), ('لوتس', 'Lotus', 80), ('بستاشيو', 'Pistachio', 90), ('نوتيلا ميكس', 'Nutella Mix', 100)])),
    cat(R, 'قسم البيتزا', 'Pizza', pizza),
    cat(R, 'قسم الفطير الحادق', 'Savory Pies', pies),
    cat(R, 'فطائر حلو', 'Sweet Pies', flat([
        ('سكر', 'Sugar', 70), ('كاستر', 'Custard', 80), ('فور سيزون', 'Four Seasons', 150), ('لقاء', 'Leqaa Special', 250),
        ('دبي', 'Dubai', 180), ('نوتيلا', 'Nutella', 120), ('نوتيلا موز', 'Nutella Banana', 150),
        ('ميكس فواكه', 'Mixed Fruit', 200), ('كنافة', 'Kunafa', 180), ('مشلتت', 'Meshaltet', 200)])),
    cat(R, 'قسم البرجر', 'Burgers', burger),
    cat(R, 'القسم السوري', 'Syrian Section', syrian),
    cat(R, 'الرول', 'Rolls', flat([('رول لحوم', 'Beef Roll', 150), ('رول تشيكن', 'Chicken Roll', 140), ('رول جبن', 'Cheese Roll', 130)])),
    cat(R, 'ركن المكرونة', 'Pasta Corner', flat([
        ('كرسبي', 'Crispy', 100), ('شاورما', 'Shawarma', 100), ('سجق', 'Sausage', 90), ('بسطرمة', 'Pastrami', 130),
        ('نجرسكو', 'Negresco', 120), ('لحمة', 'Beef', 100), ('لحوم', 'Meat', 120)])),
    cat(R, 'حواوشي اند كالزوني', 'Hawawshi & Calzone', flat([
        ('اسكندراني', 'Alexandrian', 80), ('ايطالي', 'Italian', 110), ('لحوم', 'Beef', 120), ('كالزوني', 'Calzone', 120)])),
    cat(R, 'الوجبات', 'Meals', flat([
        ('وجبة كرسبي 3', 'Crispy Meal (3 pcs)', 120), ('وجبة كرسبي 6', 'Crispy Meal (6 pcs)', 200),
        ('وجبة كرسبي 10', 'Crispy Meal (10 pcs)', 300), ('سناك بوكس 3 قطع', 'Snack Box (3 pcs)', 150),
        ('فاميلي بوكس 6 قطع', 'Family Box (6 pcs)', 250), ('شيش 3', 'Shish (3 skewers)', 150), ('كفتة 3', 'Kofta (3 skewers)', 150)])),
    cat(R, 'الفتة', 'Fatta', flat([('فتة شاورما', 'Shawarma Fatta', 120), ('فتة كرسبي', 'Crispy Fatta', 120), ('فتة ميكس', 'Mixed Fatta', 150)])),
    cat(R, 'القسم العربي', 'Arabic Section', flat([('وجبة شاورما عربي - 6 قطع', 'Arabic Shawarma Meal - 6 pcs', 100), ('وجبة شاورما عربي - 12 قطعة', 'Arabic Shawarma Meal - 12 pcs', 200)])),
    cat(R, 'المقبلات والإضافات', 'Sides & Extras', [
        item('رز بسمتي مبهر', 'Spiced Basmati Rice', [('صغير', 'Small', 35), ('كبير', 'Large', 60)])] + flat([
        ('شيدر', 'Cheddar', 20), ('رانش', 'Ranch', 20), ('تاكسس', 'Taxes Sauce', 20), ('بافلو', 'Buffalo', 20),
        ('موتزريلا ستيك', 'Mozzarella Sticks', 50), ('حلقات بصل', 'Onion Rings', 50),
        ('باكت بطاطس', 'Fries Packet', 30), ('باكت تشيز', 'Cheese Packet', 40)])),

    cat(C, 'مشروبات ساخنة', 'Hot Drinks', [
        item('اسبريسو', 'Espresso', [('سنجل', 'Single', 50), ('دبل', 'Double', 70)]),
        item('ميكاتو', 'Macchiato', [('سنجل', 'Single', 60), ('دبل', 'Double', 80)])] + flat([
        ('شاي أحمد تي', 'Ahmad Tea', 30), ('شاي أخضر', 'Green Tea', 30), ('شاي', 'Tea', 20), ('ينسون', 'Anise', 20),
        ('نعناع', 'Mint', 20), ('نعناع جنزبيل / قرفة', 'Mint Ginger / Cinnamon', 30), ('كركدية', 'Hibiscus', 30),
        ('هوت سيدر', 'Hot Cider', 45), ('هواي سيدر', 'Hawaii Cider', 50), ('هوت شوكليت', 'Hot Chocolate', 50),
        ('هوت شوكليت مارشميلو', 'Hot Chocolate Marshmallow', 60), ('سحلب سادة', 'Sahlab Plain', 40),
        ('سحلب فواكه', 'Sahlab Fruit', 70), ('سحلب مكسرات + فواكه', 'Sahlab Nuts + Fruit', 80),
        ('قهوة تركي', 'Turkish Coffee', 30), ('قهوة تركي دبل', 'Turkish Coffee Double', 60),
        ('قهوة فرنساوي', 'French Coffee', 50), ('قهوة فرنساوي نوتيلا', 'French Coffee Nutella', 60),
        ('كورتادو', 'Cortado', 60), ('فلات وايت', 'Flat White', 70), ('نسكافيه', 'Nescafe', 50),
        ('كابتشينو', 'Cappuccino', 70), ('كابتشينو مارشميلو', 'Cappuccino Marshmallow', 90),
        ('موكا وايت تشوكليت', 'White Chocolate Mocha', 70), ('لاتيه', 'Latte', 70), ('سبانش لاتيه', 'Spanish Latte', 80)])),
    cat(C, 'ميلك شيك', 'Milkshake', flat([
        ('ميلك مانجو', 'Mango Milkshake', 80), ('ميلك فراولة', 'Strawberry Milkshake', 80), ('ميلك بلوبيري', 'Blueberry Milkshake', 80),
        ('ميلك تشوكليت', 'Chocolate Milkshake', 80), ('ميلك أوريو', 'Oreo Milkshake', 80), ('ميلك خوخ', 'Peach Milkshake', 80),
        ('ميلك كراميل', 'Caramel Milkshake', 80), ('ميلك وايت', 'White Milkshake', 80),
        ('ميلك بيستاشيو', 'Pistachio Milkshake', 90), ('ميلك لوتس', 'Lotus Milkshake', 80)])),
    cat(C, 'موخيتو', 'Mojito', flat([
        ('كلاسيك', 'Classic', 70), ('صن شاين', 'Sunshine', 70), ('صن رايز', 'Sunrise', 70), ('بلو سكاي', 'Blue Sky', 70),
        ('موخيتو خوخ', 'Peach Mojito', 80), ('موخيتو بلوبيري', 'Blueberry Mojito', 80),
        ('موخيتو باشون فروت', 'Passion Fruit Mojito', 80), ('موخيتو ريد بول', 'Red Bull Mojito', 110), ('موخيتو توت', 'Berry Mojito', 80)])),
    cat(C, 'اسموزي', 'Smoothies', flat([
        ('اسموزي مانجو', 'Mango Smoothie', 70), ('اسموزي فراولة', 'Strawberry Smoothie', 70), ('اسموزي بلوبيري', 'Blueberry Smoothie', 70),
        ('اسموزي كيوي', 'Kiwi Smoothie', 70), ('اسموزي ليمون نعناع', 'Lemon Mint Smoothie', 70), ('اسموزي خوخ', 'Peach Smoothie', 70),
        ('اسموزي تفاح', 'Apple Smoothie', 70), ('اسموزي أناناس', 'Pineapple Smoothie', 70), ('اسموزي باشون فروت', 'Passion Fruit Smoothie', 70)])),
    cat(C, 'عصائر فريش', 'Fresh Juice', flat([
        ('مانجو', 'Mango', 70), ('جوافة', 'Guava', 70), ('فراولة', 'Strawberry', 70), ('برتقال', 'Orange', 70),
        ('موز حليب', 'Banana Milk', 70), ('كيوي', 'Kiwi', 100), ('أفوكادو', 'Avocado', 120), ('ليمون', 'Lemon', 50),
        ('ليمون نعناع', 'Lemon Mint', 50), ('بلح حليب', 'Dates & Milk', 100), ('بلح حليب مكسرات', 'Dates, Milk & Nuts', 90)])),
    cat(C, 'فرابية وفرابتشينو', 'Frappe & Frappuccino', flat([
        ('فرابية تشوكليت', 'Chocolate Frappe', 80), ('فرابية كراميلا', 'Caramel Frappe', 80), ('فرابية نوتيلا', 'Nutella Frappe', 80),
        ('فرابية لوتس', 'Lotus Frappe', 80), ('فرابية وايت', 'White Frappe', 80), ('فرابية أوريو', 'Oreo Frappe', 80),
        ('فرابية هوهوز', 'Hohos Frappe', 80),
        ('فرابتشينو تشوكليت', 'Chocolate Frappuccino', 70), ('فرابتشينو كراميلا', 'Caramel Frappuccino', 70),
        ('فرابتشينو نوتيلا', 'Nutella Frappuccino', 70), ('فرابتشينو لوتس', 'Lotus Frappuccino', 70),
        ('فرابتشينو وايت', 'White Frappuccino', 70), ('فرابتشينو أوريو', 'Oreo Frappuccino', 70),
        ('فرابتشينو هوهوز', 'Hohos Frappuccino', 70)])),
    cat(C, 'مشروبات غازية', 'Soft Drinks', flat([
        ('مياه', 'Water', 10), ('سفن', 'Seven Up', 40), ('كوكاكولا', 'Coca-Cola', 40), ('فانتا', 'Fanta', 40),
        ('تويست', 'Twist', 40), ('استنج', 'Sting', 40), ('مونستر', 'Monster', 80), ('ريد بول', 'Red Bull', 80),
        ('شويبس', 'Schweppes', 40), ('فيروز', 'Fayrouz', 40)])),
    cat(C, 'المرطبات', 'Cold Treats', flat([
        ('سلطة فواكه', 'Fruit Salad', 70), ('سلطة فواكه آيس كريم', 'Fruit Salad with Ice Cream', 80),
        ('سلطة فواكه لقاء', 'Leqaa Fruit Salad', 80), ('آيس كريم فواكه', 'Fruit Ice Cream', 40),
        ('آيس كريم ميكس', 'Mixed Ice Cream', 50), ('آيس كريم كيت كات', 'Kit Kat Ice Cream', 70)])),
    cat(C, 'الحلويات', 'Desserts', flat([
        ('وافل نوتيلا', 'Nutella Waffle', 70), ('وافل بيستاشيو', 'Pistachio Waffle', 80), ('وافل كراميل', 'Caramel Waffle', 70),
        ('وافل ميكس', 'Mixed Waffle', 100), ('بان كيك نوتيلا', 'Nutella Pancake', 70), ('بان كيك بيستاشيو', 'Pistachio Pancake', 80),
        ('بان كيك كراميل', 'Caramel Pancake', 70), ('بان كيك ميكس', 'Mixed Pancake', 100),
        ('تشيز كيك نوتيلا', 'Nutella Cheesecake', 70), ('تشيز كيك فراولة', 'Strawberry Cheesecake', 70),
        ('ميني تورتة', 'Mini Cake', 120), ('ميني تورتة + إضافات', 'Mini Cake + Extras', 150)])),
]

menu = {
    'settings': {
        'name': {'ar': 'مطعم وكافيه لقاء', 'en': 'LEQAA Restaurant & Cafe'},
        'tagline': {'ar': 'مطعم وكافيه للعائلات', 'en': 'Family restaurant & cafe'},
        'phones': ['01555888894', '01122322116', '01050500172'],
        'complaints': '01002450004',
        'address': {'ar': 'البحيرة - أبو المطامير - شارع الشعراوي - أمام الجنينة - عند الحصان',
                    'en': 'Beheira - Abu al-Matamir - El-Sharawy St. - opposite the garden - near the horse statue'},
        'currencyNote': {'ar': 'الأسعار بالجنيه المصري', 'en': 'Prices in Egyptian pounds (EGP)'},
        'delivery': True, 'ordering': True, 'tables': 30,
    },
    'categories': categories,
}
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'seed-menu.json')
with open(out, 'w', encoding='utf8') as f:
    json.dump(menu, f, ensure_ascii=False, indent=1)
items = [i for c in categories for i in c['items']]
print(len(categories), 'categories,', len(items), 'items,',
      sum(1 for i in items if any(p['price'] is None for p in i['prices'])), 'without price')
