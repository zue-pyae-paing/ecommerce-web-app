import { CreateCategoryDto, UpdateCategoryDto } from "../dtos/category.dto.js";
import { prisma } from "../lib/prisma.js";
import createError from "http-errors";
const categoryService = {
  getAllCategories: async () => {
    const categories = await prisma.category.findMany();
    return categories;
  },
  getOneCategory: async (id: string) => {
    if (!id) throw createError.BadRequest("Category id not found");
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw createError.NotFound("Category not found!");
    return category;
  },
  createCategory: async (dto: CreateCategoryDto) => {
    const slug = dto.name.toLowerCase().replace(/ /g, "-");
    const category = await prisma.category.create({ data: { ...dto, slug } });
    if (!category)
      throw createError.InternalServerError("Category not created!");
    return category;
  },
  updateCategory: async (dto: UpdateCategoryDto) => {
    if (!dto.id) throw createError.BadRequest("Category id not found");
    const existiongCategory = await prisma.category.findUnique({
      where: { id: dto.id },
    });
    if (!existiongCategory) throw createError.NotFound("Category not found!");
    let slug = existiongCategory.slug;
    if (dto.name) slug = dto.name.toLowerCase().replace(/ /g, "-");
    const category = await prisma.category.update({
      where: { id: dto.id },
      data: { ...dto ,slug},
    });
    if (!category)
      throw createError.InternalServerError("Category not updated!");
    return category;
  },
  deleteCategory: async (id: string) => {
    if (!id) throw createError.BadRequest("Category id not found");
    const existiongCategory = await prisma.category.findUnique({
      where: { id },
    });
    if (!existiongCategory) throw createError.NotFound("Category not found!");
    const category = await prisma.category.delete({ where: { id } });
    if (!category)
      throw createError.InternalServerError("Category not deleted!");
    return category;
  },
};

export default categoryService;
