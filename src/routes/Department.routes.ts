import { Router } from "express";
import { departmentController } from "../controllers";
import { authMiddleware, requireAdmin } from "../middlewares";
import { createDepartmentValidator, updateDepartmentValidator } from "../validators";

const router = Router();
/**
 * @swagger
 * /departments:
 *    get: 
 *      summary: Lấy danh sách phòng ban
 *      tags: [Departments]
 *      parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: Số trang
 *        - in: query
 *          name: limit
 *          schema: 
 *            type: integer
 *          description: Số lượng mỗi trang
 *        - in: query
 *          name: sortBy
 *          schema: 
 *            type: string
 *          description: Trường sắp xếp
 *        - in: query
 *          name: sortOrder
 *          schema: 
 *            type: string
 *            enum: [asc, desc]
 *          description: Thứ tự sắp xếp
 *        - in: query
 *          name: q
 *          schema:
 *            type: string
 *          description: Từ khóa tìm kiếm tên/email
 *      responses:
 *        200:
 *          description: Danh sách phòng ban
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  departments:
 *                    type: array
 *                    items:
 *                       $ref: './docs/schemas/Department.yaml'
 */
router.get('/', authMiddleware, departmentController.getAllDepartments);
// router.get('/search', authMiddleware, searchDepartmentValidator, departmentController.search);
router.get('/:id', authMiddleware, departmentController.getDetailDepartment);

router.post('/', authMiddleware, createDepartmentValidator, departmentController.createDepartment);
router.put('/:id', authMiddleware, requireAdmin, updateDepartmentValidator, departmentController.updateDepartment);
router.delete('/:id', authMiddleware, requireAdmin, departmentController.deleteDepartment);

export default router;
