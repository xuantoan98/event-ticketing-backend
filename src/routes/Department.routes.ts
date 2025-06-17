/**
 * @swagger
 * components:
 *  schemas:
 *    Department:
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID của department (ObjectId)
 *        name:
 *          type: string
 *          description: Tên của department
 *        email:
 *          type: string
 *          format: email
 *          description: Email của department
 *        phone:
 *          type: string
 *          description: Số điện thoại của department
 *        description:
 *          type: string
 *          description: Mô tả về department
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái của department (0: Inactive, 1: Active)"
 *        createdBy:
 *          type: string
 *          description: ID của user tạo department (ObjectId)
 *        updatedBy:
 *          type: string
 *          description: ID của user cập nhật department (ObjectId)
 *        createdAt:
 *          type: string
 *          format: date-time
 *          description: Thời gian tạo
 *        updatedAt:
 *          type: string
 *          format: date-time
 *          description: Thời gian cập nhật
 *        required:
 *          - name
 *          - email
 *    DepartmentCreate:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Tên phòng ban
 *        email:
 *          type: string
 *          description: Email phòng ban
 *        phone:
 *          type: string
 *          description: Số điện thoại phòng ban
 *        description:
 *          type: string
 *          description: Mô tả phòng ban
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái hoạt động phòng ban (0: Inactive, 1: Active)"
 *        required:
 *          - name
 *          - email
 */

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
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Department'
 */

/**
 * @swagger
 * /departments/{id}:
 *  get:
 *    summary: Lấy chi tiết phòng ban theo ID
 *    tags: [Departments]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        shema:
 *          type: string
 *        description: ID của phòng ban
 *    responses:
 *      200:
 *        description: Thông tin phòng ban
 *        content: 
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *      404:
 *        description: Phòng ban không tồn tại
 */

/**
 * @swagger
 * /departments:
 *  post:
 *    summary: Tạo mới thông tin phòng ban
 *    tags: [Departments]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/DepartmentCreate'
 *    responses:
 *      201:
 *        description: Tạo mới phòng ban thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /departments/{id}:
 *  put:
 *    summary: Cập nhật thông tin phòng ban
 *    tags: [Departments]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID phòng ban
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Department'
 *    responses:
 *      200:
 *        dedescription: Cập nhật thông tin phòng ban thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Department'
 *      400:
 *        description: Phòng ban không tồn tại
 */

/**
 * @swagger
 * /departments/{id}:
 *  delete:
 *    summary: Xóa thông tin phòng ban
 *    tags: [Departments]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID phòng ban
 *    responses:
 *      200:
 *        description: Xóa thông tin phòng ban thành công
 *      400:
 *        description: Phòng ban không tồn tại
 */

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
