# 📝 Simple Todo App

একটি সহজ, পরিচ্ছন্ন ও কার্যকরী টোডো অ্যাপ্লিকেশন যা **React 19**, **Vite**, **Tailwind CSS v4**, **JSONPlaceholder API** এবং ব্রাউজারের **LocalStorage** দিয়ে তৈরি।

---

## 🌟 মূল বৈশিষ্ট্যসমূহ (Features)

1. **ইন্টারনেট থেকে ডেটা ফেচ (JSONPlaceholder API Integration)**:
   - অ্যাপ চালুর সময় ব্রাউজারে আগে থেকে কোনো টাস্ক না থাকলে স্বয়ংক্রিয়ভাবে `https://jsonplaceholder.typicode.com/todos` থেকে প্রাথমিক টাস্কগুলো লোড হয়।

2. **লোকাল ডেটাবেজ (LocalStorage Database)**:
   - কোনো বাহ্যিক ডেটাবেজের প্রয়োজন নেই।
   - সব টাস্ক ব্রাউজারের `localStorage`-এ সংরক্ষিত থাকে (`todo_app_tasks`)।
   - পেজ রিলোড বা ব্রাউজার বন্ধ করলেও আগের ডেটা সংরক্ষিত থাকে।

3. **নতুন টাস্ক যোগ করা (Add New Todo)**:
   - ইনপুট ফিল্ডে লিখে `Add` বাটনে ক্লিক করে বা `Enter` চেপে সহজে নতুন টাস্ক যোগ করা যায়।
   - প্রতিটি নতুন টাস্কের জন্য `Date.now()` দিয়ে ইউনিক আইডি জেনারেট হয়।

4. **টাস্ক সম্পন্ন মার্ক করা (Toggle Completion)**:
   - চেকবক্সে ক্লিক করে টাস্ক কমপ্লিট বা ইনকমপ্লিট করা যায়। সম্পন্ন টাস্কের উপর স্ট্রাইকথ্রু (কাটা দাগ) দেখায়।

5. **টাস্ক ডিলিট করা (Delete Todo)**:
   - ডিলিট বাটনে ক্লিক করে অপ্রয়োজনীয় টাস্ক নিমেষেই মুছে ফেলা যায়।

6. **API থেকে পুনরায় ডেটা লোড (Reload from API)**:
   - সবগুলো টাস্ক মুছে ফেললে স্ক্রিনে "Reload from API" বাটন ভেসে ওঠে।
   - এছাড়া হেডারের রিলোড আইকনে ক্লিক করে যেকোনো সময় API থেকে ডেটা রিলোড করা যায়।

7. **টাস্ক কাউন্টার (Summary Counter)**:
   - মোট কয়টি টাস্ক আছে এবং কয়টি সম্পন্ন হয়েছে তা নিচে রিয়েল-টাইমে প্রদর্শিত হয়।

---

## 🛠️ ব্যবহৃত প্রযুক্তি (Tech Stack)

* **Frontend Library:** React 19
* **Build Tool:** Vite
* **Styling:** Tailwind CSS v4
* **API:** JSONPlaceholder (REST API)
* **Storage:** Browser LocalStorage

---

## 🚀 যেভাবে চালাবেন (How to Run Locally)

```bash
# ডিপেন্ডেন্সি ইনস্টল করতে
npm install

# ডেভেলপমেন্ট সার্ভার চালু করতে
npm run dev

# প্রোডাকশন বিল্ড তৈরি করতে
npm run build
```

---

## 🌐 Netlify-তে ডিপ্লয় করার নিয়ম (Deploy to Netlify)

1. গিটহাবে (GitHub) রিপোজিটরি পুশ করুন।
2. Netlify-তে লগইন করে **"Add new site" > "Import an existing project"** সিলেক্ট করুন।
3. GitHub থেকে এই রিপোজিটরিটি সিলেক্ট করুন।
4. বিল্ড সেটিংস অটোমেটিক নিয়ে নেবে (`netlify.toml` ফাইলে কনফিগার করা আছে):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **"Deploy site"** বাটনে ক্লিক করুন।
