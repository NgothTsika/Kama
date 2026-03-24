"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../src/utils/prisma"));
/**
 * Seed script to populate initial data
 */
async function main() {
    console.log("🌱 Starting seed...");
    // ==================== LANGUAGES ====================
    const languages = await prisma_1.default.language.createMany({
        data: [
            { code: "en", name: "English" },
            { code: "fr", name: "Français" },
            { code: "es", name: "Español" },
            { code: "pt", name: "Português" },
            { code: "sw", name: "Swahili" },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ Created ${languages.count} languages`);
    // ==================== COUNTRIES ====================
    const countries = await prisma_1.default.country.createMany({
        data: [
            { code: "NG", name: "Nigeria" },
            { code: "ZA", name: "South Africa" },
            { code: "KE", name: "Kenya" },
            { code: "GH", name: "Ghana" },
            { code: "ET", name: "Ethiopia" },
            { code: "UG", name: "Uganda" },
            { code: "TZ", name: "Tanzania" },
            { code: "RW", name: "Rwanda" },
            { code: "US", name: "United States" },
            { code: "GB", name: "United Kingdom" },
            { code: "FR", name: "France" },
            { code: "CD", name: "Democratic Republic of Congo" },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ Created ${countries.count} countries`);
    // ==================== CATEGORIES ====================
    // Root categories
    const continentCategory = await prisma_1.default.category.create({
        data: {
            name: "Continent",
        },
    });
    const genderCategory = await prisma_1.default.category.create({
        data: {
            name: "Gender",
        },
    });
    const roleCategory = await prisma_1.default.category.create({
        data: {
            name: "Role/Profession",
        },
    });
    // Continent subcategories
    const africaCategory = await prisma_1.default.category.create({
        data: {
            name: "Africa",
            parentId: continentCategory.id,
        },
    });
    const europeCategory = await prisma_1.default.category.create({
        data: {
            name: "Europe",
            parentId: continentCategory.id,
        },
    });
    const americasCategory = await prisma_1.default.category.create({
        data: {
            name: "Americas",
            parentId: continentCategory.id,
        },
    });
    // Gender subcategories
    const maleCategory = await prisma_1.default.category.create({
        data: {
            name: "Male",
            parentId: genderCategory.id,
        },
    });
    const femaleCategory = await prisma_1.default.category.create({
        data: {
            name: "Female",
            parentId: genderCategory.id,
        },
    });
    // Role subcategories
    const scientistCategory = await prisma_1.default.category.create({
        data: {
            name: "Scientist",
            parentId: roleCategory.id,
        },
    });
    const musicianCategory = await prisma_1.default.category.create({
        data: {
            name: "Musician",
            parentId: roleCategory.id,
        },
    });
    const athleteCategory = await prisma_1.default.category.create({
        data: {
            name: "Athlete",
            parentId: roleCategory.id,
        },
    });
    const revolutionaryCategory = await prisma_1.default.category.create({
        data: {
            name: "Revolutionary",
            parentId: roleCategory.id,
        },
    });
    console.log("✅ Created categories");
    // ==================== FIGURES ====================
    const figures = await prisma_1.default.figure.createMany({
        data: [
            {
                name: "Nelson Mandela",
                title: "Anti-apartheid activist and first Black President of South Africa",
                bio: "Nelson Rolihlahla Mandela was a South African anti-apartheid revolutionary, political leader, and philanthropist.",
                birthYear: 1918,
                deathYear: 2013,
                imageUrl: "https://example.com/mandela.jpg",
            },
            {
                name: "Marie Curie",
                title: "Physicist and Chemist",
                bio: "Marie Curie was a Polish-born physicist and chemist who conducted pioneering research on radioactivity.",
                birthYear: 1867,
                deathYear: 1934,
                imageUrl: "https://example.com/curie.jpg",
            },
            {
                name: "Miriam Makeba",
                title: "South African Singer",
                bio: "Miriam Makeba was a South African singer, actress, and activist who became an international success.",
                birthYear: 1932,
                deathYear: 1988,
                imageUrl: "https://example.com/makeba.jpg",
            },
            {
                name: "Steve Biko",
                title: "Anti-apartheid activist",
                bio: "Steve Biko was a South African anti-apartheid activist and founder of the Black Consciousness Movement.",
                birthYear: 1946,
                deathYear: 1977,
                imageUrl: "https://example.com/biko.jpg",
            },
            {
                name: "Albert Einstein",
                title: "Theoretical Physicist",
                bio: "Albert Einstein was a German-born theoretical physicist who developed the theory of relativity.",
                birthYear: 1879,
                deathYear: 1955,
                imageUrl: "https://example.com/einstein.jpg",
            },
        ],
    });
    console.log(`✅ Created ${figures.count} figures`);
    // Link figures to categories
    await prisma_1.default.figureCategory.createMany({
        data: [
            {
                figureId: figures.count > 0 ? (await prisma_1.default.figure.findFirst())?.id || "" : "",
                categoryId: africaCategory.id,
            },
            {
                figureId: figures.count > 1
                    ? (await prisma_1.default.figure.findMany({ take: 2 }))[1]?.id || ""
                    : "",
                categoryId: femaleCategory.id,
            },
            {
                figureId: figures.count > 1
                    ? (await prisma_1.default.figure.findMany({ take: 2 }))[1]?.id || ""
                    : "",
                categoryId: scientistCategory.id,
            },
        ],
        skipDuplicates: true,
    });
    // ==================== LEARNING PATHS ====================
    const path1 = await prisma_1.default.learningPath.create({
        data: {
            title: "Great African Leaders",
            description: "Learn about influential leaders in African history",
            difficulty: 2,
            isPublished: true,
        },
    });
    const path2 = await prisma_1.default.learningPath.create({
        data: {
            title: "Women in Science",
            description: "Discover the contributions of women scientists throughout history",
            difficulty: 3,
            isPublished: true,
        },
    });
    console.log("✅ Created learning paths");
    // ==================== LESSONS ====================
    const lesson1 = await prisma_1.default.lesson.create({
        data: {
            title: "Nelson Mandela: A Legacy of Freedom",
            summary: "Explore the life and impact of Nelson Mandela",
            content: "Nelson Mandela was the first Black president of South Africa...",
            order: 1,
            xpReward: 50,
            pathId: path1.id,
        },
    });
    const lesson2 = await prisma_1.default.lesson.create({
        data: {
            title: "Marie Curie: Pioneer of Radioactivity",
            summary: "Discover Marie Curie's groundbreaking scientific work",
            content: "Marie Curie was a brilliant scientist who...",
            order: 1,
            xpReward: 50,
            pathId: path2.id,
        },
    });
    console.log("✅ Created lessons");
    // Link lessons to figures
    await prisma_1.default.lessonFigure.createMany({
        data: [
            {
                lessonId: lesson1.id,
                figureId: (await prisma_1.default.figure.findFirst({ where: { name: "Nelson Mandela" } }))
                    ?.id || "",
            },
            {
                lessonId: lesson2.id,
                figureId: (await prisma_1.default.figure.findFirst({ where: { name: "Marie Curie" } }))
                    ?.id || "",
            },
        ],
        skipDuplicates: true,
    });
    // ==================== QUESTIONS ====================
    const question1 = await prisma_1.default.question.create({
        data: {
            text: "In what year was Nelson Mandela released from prison?",
            difficulty: 2,
            explanation: "Nelson Mandela was released on February 11, 1990.",
        },
    });
    const question2 = await prisma_1.default.question.create({
        data: {
            text: "What element did Marie Curie discover?",
            difficulty: 2,
            explanation: "Marie Curie discovered radium and polonium.",
        },
    });
    console.log("✅ Created questions");
    // ==================== ANSWERS ====================
    await prisma_1.default.answer.createMany({
        data: [
            { text: "1990", isCorrect: true, questionId: question1.id },
            { text: "1985", isCorrect: false, questionId: question1.id },
            { text: "1995", isCorrect: false, questionId: question1.id },
            { text: "Radium", isCorrect: true, questionId: question2.id },
            { text: "Uranium", isCorrect: false, questionId: question2.id },
            { text: "Radon", isCorrect: false, questionId: question2.id },
        ],
    });
    console.log("✅ Created answers");
    // Link questions to lessons
    await prisma_1.default.lessonQuestion.createMany({
        data: [
            { lessonId: lesson1.id, questionId: question1.id },
            { lessonId: lesson2.id, questionId: question2.id },
        ],
    });
    // ==================== FLASHCARDS ====================
    await prisma_1.default.flashcard.createMany({
        data: [
            {
                question: "Who was the first Black President of South Africa?",
                answer: "Nelson Mandela",
                lessonId: lesson1.id,
            },
            {
                question: "What did Marie Curie study?",
                answer: "Radioactivity",
                lessonId: lesson2.id,
            },
        ],
    });
    console.log("✅ Created flashcards");
    // ==================== DAILY REWARDS ====================
    await prisma_1.default.dailyReward.createMany({
        data: [
            { day: 1, xpReward: 10, coinReward: 50, heartReward: 0 },
            { day: 2, xpReward: 15, coinReward: 75, heartReward: 1 },
            { day: 3, xpReward: 20, coinReward: 100, heartReward: 0 },
            { day: 4, xpReward: 25, coinReward: 125, heartReward: 0 },
            { day: 5, xpReward: 30, coinReward: 150, heartReward: 1 },
            { day: 6, xpReward: 35, coinReward: 175, heartReward: 0 },
            { day: 7, xpReward: 50, coinReward: 250, heartReward: 2 },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Created daily rewards");
    // ==================== WEEKLY REWARDS ====================
    await prisma_1.default.weeklyReward.createMany({
        data: [
            { rankMin: 1, rankMax: 10, xpReward: 500, coinReward: 1000 },
            { rankMin: 11, rankMax: 50, xpReward: 300, coinReward: 600 },
            { rankMin: 51, rankMax: 100, xpReward: 100, coinReward: 200 },
            { rankMin: 101, rankMax: 500, xpReward: 50, coinReward: 100 },
            { rankMin: 501, rankMax: 10000, xpReward: 10, coinReward: 20 },
        ],
        skipDuplicates: true,
    });
    console.log("✅ Created weekly rewards");
    console.log("🎉 Seed completed successfully!");
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map