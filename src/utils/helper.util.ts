import { Types } from "mongoose";

/**
 * So sánh 2 ObjectId hoặc string
 * 
 * @param a ObjecId or string
 * @param b Object or string
 * @returns boolean
 */
export function objectIdEquals(a: Types.ObjectId | string, b: Types.ObjectId | string) {
  if (!a || !b) return false;

  try {
    const idA = a instanceof Types.ObjectId ? a : new Types.ObjectId(a);
    const idB = b instanceof Types.ObjectId ? b : new Types.ObjectId(b);
    return idA.equals(idB);
  } catch (err) {
    return false;
  }
}
