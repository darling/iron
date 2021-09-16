import { fstat, writeFileSync } from 'fs';
import { startCase, union } from 'lodash';
import { join } from 'path';
import { createInterface } from 'readline';

// Load env variables
require('dotenv').config();

import charList from './static/mintedchardata.json';

const b = charList.map((item) => {
	return {
		name: startCase(item.name.replace(/ \d/g, '').trimEnd()),
		icon: item.icon,
		bio: item.bio.replaceAll('"', ''),
	};
});

const a: typeof b = [
	{ name: 'Mashed Potato', icon: '001-mashed-potato', bio: "I'm Mashing!" },
	{ name: 'Honey', icon: '002-honey', bio: 'Hey honey!' },
	{
		name: 'Tofu',
		icon: '003-tofu',
		bio: "It's just a curd to me, I'm great!",
	},
	{ name: 'Watermelon', icon: '004-watermelon', bio: 'What a melon!' },
	{
		name: 'Bread',
		icon: '005-bread',
		bio: 'I knead more so my humor can rise.',
	},
	{ name: 'Egg', icon: '006-egg', bio: ':)' },
	{ name: 'Garlic', icon: '007-garlic', bio: 'Stinky' },
	{ name: 'Cauliflower', icon: '008-cauliflower', bio: 'Floret!' },
	{ name: 'Jam', icon: '009-jam', bio: 'Fighting other foods is my jam!' },
	{ name: 'Carrot', icon: '010-carrot', bio: 'I have great vision!' },
	{ name: 'Radish', icon: '011-radish', bio: "I'm a bit rad." },
	{ name: 'Olive Oil', icon: '012-olive-oil', bio: 'Drink me!' },
	{ name: 'Orange', icon: '013-orange', bio: "Orange you glad I'm here?" },
	{ name: 'Yogurt', icon: '014-yogurt', bio: 'Greek.' },
	{ name: 'Coconut', icon: '015-coconut', bio: "I'm a tough nut to crack." },
	{
		name: 'Peanut Butter',
		icon: '016-peanut-butter',
		bio: "Don't be jelly!",
	},
	{ name: 'Lettuce', icon: '017-lettuce', bio: 'Lettuce be friends' },
	{ name: 'Red Beans', icon: '018-red-beans', bio: '>:3' },
	{
		name: 'Sunny Side Up',
		icon: '019-sunny-side-up',
		bio: "I'll leave my enemies scrambled",
	},
	{ name: 'Butter', icon: '020-Butter', bio: "I don't want to spread it" },
	{ name: 'Milk', icon: '021-milk', bio: 'An udder failure' },
	{ name: 'Cheese', icon: '022-cheese', bio: 'Just gotta Brie-leave' },
	{ name: 'Grapes', icon: '023-grapes', bio: 'nice.' },
	{
		name: 'Canned Food',
		icon: '024-canned-food',
		bio: "I'd give it an ate out of tin.",
	},
	{ name: 'Peanut', icon: '025-peanut', bio: 'Nice nuts' },
	{ name: 'Vegetable', icon: '026-vegetable', bio: 'Healthy!' },
	{ name: 'Soy Milk', icon: '027-soy-milk', bio: "I'm like milk but not" },
	{
		name: 'Infused Water',
		icon: '028-infused-water',
		bio: "I'm like water but not",
	},
	{ name: 'Apple Cider', icon: '029-apple-cider', bio: 'Ready for battle!' },
	{ name: 'Spinach', icon: '030-spinach', bio: 'Nobody likes me.' },
	{ name: 'Banana', icon: '031-banana', bio: 'You are bananas!' },
	{ name: 'Smoothie', icon: '032-smoothie', bio: 'Smooth criminal' },
	{ name: 'Tomato', icon: '033-tomato', bio: 'tomato tomato' },
	{ name: 'Granola', icon: '034-granola', bio: 'I am just nuts' },
	{ name: 'Fruit Salad', icon: '035-fruit-salad', bio: 'Yummy yummy!' },
	{ name: 'Pickles', icon: '036-pickles', bio: "I'm kind of a big dill" },
	{ name: 'Kimchi', icon: '037-kimchi', bio: "I'm pretty cultured" },
	{ name: 'Corn', icon: '038-corn', bio: 'Corny' },
	{ name: 'Mushroom', icon: '039-mushroom', bio: 'I have great morels' },
	{ name: 'Avocado', icon: '040-avocado', bio: 'glockamole 🔫' },
	{
		name: 'Oatmeal',
		icon: '041-oatmeal',
		bio: "I'm like meatloaf but I don't give an 'f'",
	},
	{ name: 'Green Tea', icon: '042-green-tea', bio: "Let's stir things up!" },
	{ name: 'Strawberry', icon: '043-strawberry', bio: 'Berry powerful' },
	{ name: 'Boiled Egg', icon: '044-boiled-egg', bio: 'Egg :)' },
	{ name: 'Papaya', icon: '045-papaya', bio: 'YEAH!' },
	{
		name: 'Pineapple',
		icon: '046-pineapple',
		bio: 'Me and Pizza are a debatable match, what do you think?',
	},
	{ name: 'Apple', icon: '047-apple', bio: 'Apples to Apples' },
	{ name: 'Almond', icon: '048-almond', bio: 'I can make milk' },
	{ name: 'Broccoli', icon: '049-broccoli', bio: 'The best vegetable' },
	{
		name: 'Orange Juice',
		icon: '050-orange-juice',
		bio: 'Where did Orange go?',
	},
];

const c = union(a, b);

writeFileSync(join(__dirname, 'uwu.json'), JSON.stringify(c, null, 2));

// import './pg';
// import './discord';
