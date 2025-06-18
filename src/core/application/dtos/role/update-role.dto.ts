import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionDto } from '../permission/create-permission.dto';

export class UpdateRoleDto {
  @ApiProperty({ description: 'Name of the role', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Description of the role', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Active status of the role', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Array of menu IDs to assign to the role', required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  menuIds?: number[];

  @ApiProperty({ description: 'Array of permissions', type: [PermissionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions?: PermissionDto[];
} 