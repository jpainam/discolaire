import { z } from "zod";

export const subMenuItemType = z.object({
  name: z.string(),
  description: z.string().optional(),
  href: z.string(),
  badge: z.string().optional(),
});
export type SubMenuItemType = z.infer<typeof subMenuItemType>;
/*export interface SubMenuItemType {
  name: string;
  description?: string;
  href: string;
  badge?: string;
}*/

export const itemType = z.object({
  name: z.string(),
  href: z.string().optional(),
  description: z.string().optional(),
  badge: z.string().optional(),
  subMenuItems: z.array(subMenuItemType).optional(),
});
export type ItemType = z.infer<typeof itemType>;

export const menuItemsType = z.object({
  id: z.number(),
  name: z.string(),
  title: z.string(),
  href: z.string().nullish(),
  badge: z.string().nullish(),
  menuItems: z.array(itemType),
});
export const menuItemsTypeList = z.array(menuItemsType);
export type MenuItemsType = z.infer<typeof menuItemsType>;
