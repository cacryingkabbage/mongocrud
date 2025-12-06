import Category from "../models/Category.js";
import catchAsync from "../utils/catchAsync.js";

export const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, categories });
});

export const getCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ success: true, category });
});

export const updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ success: true, message: "Category updated", category });
});

export const deleteCategory = catchAsync(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Category deleted" });
});
