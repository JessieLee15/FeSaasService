let testRelationdao = require('../dao/testRelation')
module.exports = {
  async createMaster(ctx){
    await testRelationdao.createMaster(ctx.request.body);
    return true;
  },
  async createMany(ctx){
    await testRelationdao.createMany(ctx.request.body);
    return true;
  },
  async createMasterAndMany(ctx){
    await testRelationdao.createMasterAndMany(ctx.request.body.master, ctx.request.body.many);
    return true;
  }
}