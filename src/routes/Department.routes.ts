import { Router } from "express";
import { departmentController } from "../controllers";
import { authMiddleware, requireAdmin } from "../middlewares";
import { departmentValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, departmentController.getAllDepartments);
router.get('/search', authMiddleware, departmentValidator('search'), departmentController.search);
router.get('/:id', authMiddleware, departmentController.getDetailDepartment);

router.post('/', authMiddleware, departmentValidator('create'), departmentController.createDepartment);
router.put('/:id', authMiddleware, departmentValidator('update'), departmentController.updateDepartment);
router.delete('/:id', authMiddleware, departmentController.deleteDepartment);

export default router;
