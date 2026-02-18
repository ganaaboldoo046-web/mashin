import { onRequest as __api_images__name__ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\images\\[name].ts"
import { onRequestGet as __api_exchange_rate_ts_onRequestGet } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\exchange_rate.ts"
import { onRequestPost as __api_exchange_rate_ts_onRequestPost } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\exchange_rate.ts"
import { onRequestPost as __api_reservations_create_ts_onRequestPost } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\reservations_create.ts"
import { onRequestGet as __api_reservations_list_ts_onRequestGet } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\reservations_list.ts"
import { onRequestPost as __api_reservations_update_ts_onRequestPost } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\reservations_update.ts"
import { onRequest as __api_banners_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\banners.ts"
import { onRequest as __api_banners_delete_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\banners_delete.ts"
import { onRequest as __api_categories_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\categories.ts"
import { onRequest as __api_categories_create_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\categories_create.ts"
import { onRequest as __api_categories_delete_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\categories_delete.ts"
import { onRequest as __api_categories_reorder_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\categories_reorder.ts"
import { onRequest as __api_products_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\products.ts"
import { onRequest as __api_products_create_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\products_create.ts"
import { onRequest as __api_products_delete_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\products_delete.ts"
import { onRequest as __api_upload_ts_onRequest } from "C:\\Users\\agape\\OneDrive\\바탕 화면\\TEMMUN CAR\\functions\\api\\upload.ts"

export const routes = [
    {
      routePath: "/api/images/:name",
      mountPath: "/api/images",
      method: "",
      middlewares: [],
      modules: [__api_images__name__ts_onRequest],
    },
  {
      routePath: "/api/exchange_rate",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_exchange_rate_ts_onRequestGet],
    },
  {
      routePath: "/api/exchange_rate",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_exchange_rate_ts_onRequestPost],
    },
  {
      routePath: "/api/reservations_create",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_reservations_create_ts_onRequestPost],
    },
  {
      routePath: "/api/reservations_list",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_reservations_list_ts_onRequestGet],
    },
  {
      routePath: "/api/reservations_update",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_reservations_update_ts_onRequestPost],
    },
  {
      routePath: "/api/banners",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_banners_ts_onRequest],
    },
  {
      routePath: "/api/banners_delete",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_banners_delete_ts_onRequest],
    },
  {
      routePath: "/api/categories",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_categories_ts_onRequest],
    },
  {
      routePath: "/api/categories_create",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_categories_create_ts_onRequest],
    },
  {
      routePath: "/api/categories_delete",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_categories_delete_ts_onRequest],
    },
  {
      routePath: "/api/categories_reorder",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_categories_reorder_ts_onRequest],
    },
  {
      routePath: "/api/products",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_products_ts_onRequest],
    },
  {
      routePath: "/api/products_create",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_products_create_ts_onRequest],
    },
  {
      routePath: "/api/products_delete",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_products_delete_ts_onRequest],
    },
  {
      routePath: "/api/upload",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_upload_ts_onRequest],
    },
  ]