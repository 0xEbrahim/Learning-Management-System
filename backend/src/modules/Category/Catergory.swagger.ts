// backend/src/modules/Category/Category.swagger.ts

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         name:
 *           type: string
 *           example: "Programming"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CategoryWithCourses:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60f8d1f9a9b8c71f3c3e3e3e"
 *         name:
 *           type: string
 *           example: "Programming"
 *         courses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               course:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Advanced JavaScript"
 *                   thumbnail:
 *                     type: string
 *                     example: "https://res.cloudinary.com/.../image/upload/v1..."
 *                   price:
 *                     type: number
 *                     example: 149.99
 *                   description:
 *                     type: string
 *                     example: "Deep dive into JavaScript concepts"
 *
 *     CategoryListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "Success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         data:
 *           type: object
 *           properties:
 *             category:
 *               $ref: '#/components/schemas/CategoryWithCourses'
 *
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 25
 *           example: "Programming"
 *
 *   parameters:
 *     categoryIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: The category ID
 *
 *     paginationQuery:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number
 *
 *     limitQuery:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Number of items per page
 *
 *     sortQuery:
 *       in: query
 *       name: sort
 *       schema:
 *         type: string
 *       description: Sort by field (prefix with - for descending)
 *
 *     fieldsQuery:
 *       in: query
 *       name: fields
 *       schema:
 *         type: string
 *       description: Comma-separated list of fields to return
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get all categories (paginated)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *       - $ref: '#/components/parameters/sortQuery'
 *       - $ref: '#/components/parameters/fieldsQuery'
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryListResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Get category by ID with associated courses
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/categoryIdParam'
 *     responses:
 *       200:
 *         description: Category details with courses
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/v1/categories/{categoryId}/courses:
 *   get:
 *     summary: Get courses for a specific category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/categoryIdParam'
 *       - $ref: '#/components/parameters/paginationQuery'
 *       - $ref: '#/components/parameters/limitQuery'
 *     responses:
 *       200:
 *         description: List of courses in the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Advanced JavaScript"
 *                           thumbnail:
 *                             type: string
 *                             example: "https://res.cloudinary.com/.../image/upload/v1..."
 *                           price:
 *                             type: number
 *                             example: 149.99
 *                           description:
 *                             type: string
 *                             example: "Deep dive into JavaScript concepts"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */
