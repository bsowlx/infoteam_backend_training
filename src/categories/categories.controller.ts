import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdpAuthGuard } from '../auth/guards/idp-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(IdpAuthGuard)
  @Post()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a category (requires authentication)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category slug already exists' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto.slug);
  }

  @UseGuards(IdpAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a category by ID (requires authentication)' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: String })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @UseGuards(IdpAuthGuard)
  @Post(':id/subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Subscribe to a category (requires authentication)' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: String })
  @ApiResponse({ status: 200, description: 'Subscribed successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Already subscribed' })
  subscribe(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.categoriesService.subscribe(id, user.id);
  }

  @UseGuards(IdpAuthGuard)
  @Delete(':id/subscribe')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unsubscribe from a category (requires authentication)' })
  @ApiParam({ name: 'id', description: 'Category ID (UUID)', type: String })
  @ApiResponse({ status: 200, description: 'Unsubscribed successfully' })
  @ApiResponse({ status: 404, description: 'Category or subscription not found' })
  unsubscribe(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.categoriesService.unsubscribe(id, user.id);
  }
}
