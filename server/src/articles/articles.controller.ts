// export const createArticle = async (article: Article) => {
//   return await prisma.article.create({
//     data: {
//       title: article.title,
//       description: article.description,
//       body: article.body,
//       content: article.content,
//       date: article.date,
//       categoryId: article.category.id,
//       tags: {
//         connect: article.tags.map((tag) => {
//           return { id: tag.id };
//         }),
//       },
//     },
//   });
// };
