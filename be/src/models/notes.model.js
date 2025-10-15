export const columns = ['0m', '20m', '1h', '9h', '1d', '3d', '7d', '16d', '30d', '60d', '90d', '180d'];

export function serialize(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { _id: _id.toString(), ...rest };
}
// Optional JS schema object for documentation / validation reference.
// We are using the native MongoDB driver (no Mongoose), so this is only
// a helpful description for the codebase rather than enforced by the DB.
export const noteSchema = {
  title: { type: 'string', required: true },
  content: { type: 'string', required: false },
  currentPosition: { type: 'string', enum: columns, default: '0m' },
  reviewCount: { type: 'number', default: 0 },
  nextReviewTime: { type: 'string', format: 'date-time', nullable: true },
  createdAt: { type: 'string', format: 'date-time' }
};
