export function request(ctx) {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({ id: ctx.args.id })
  };
}

export function response(ctx) {
  if (!ctx.result) {
    return null;
  }
  
  return {
    id: ctx.result.id,
    userId: ctx.result.userId,
    createdAt: ctx.result.createdAt,
    payLoad: JSON.parse(ctx.result.payLoad)
  };
}