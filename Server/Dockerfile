# שלב 1: שימוש בבסיס Node
FROM node:18

# שלב 2: הגדרת תיקיית העבודה
WORKDIR /app

# שלב 3: העתקת package.json והתקנת תלויות
COPY package*.json ./
RUN npm install

# שלב 4: העתקת שאר הקבצים
COPY . .

# שלב 5: פתיחת פורט
EXPOSE 3000

# שלב 6: פקודת הרצה
CMD ["npm", "start"]
