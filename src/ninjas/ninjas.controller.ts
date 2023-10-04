import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('ninjas')
export class NinjasController {
  @Get()
  getNinjas() {
    return "You've not got any ninjas yet";
  }

  @Get(':id')
  getOneNinja(@Param('id') id: string, @Query('type') type: string) {
    return { id, type };
  }
}
