import { Router } from "express";
import { departmentController } from "../controllers";
import { authMiddleware, requireAdmin } from "../middlewares";
import { createDepartmentValidator, updateDepartmentValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, departmentController.getAllDepartments);
// router.get('/search', authMiddleware, searchDepartmentValidator, departmentController.search);
router.get('/:id', authMiddleware, departmentController.getDetailDepartment);

router.post('/', authMiddleware, createDepartmentValidator, departmentController.createDepartment);
router.put('/:id', authMiddleware, requireAdmin, updateDepartmentValidator, departmentController.updateDepartment);
router.delete('/:id', authMiddleware, requireAdmin, departmentController.deleteDepartment);

export default router;
