


import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { error } from 'console'; // Import error function from console module
import { Observable } from 'rxjs'; // Import Observable class from rxjs module

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private roles: string[]) {} // Constructor nhận một mảng các vai trò

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest(); // Lấy request từ ExecutionContext
    const currentUser = request.currentUser; // Lấy thông tin người dùng hiện tại từ request

    if (!currentUser) { // Kiểm tra nếu không có người dùng hiện tại
      console.log('RolesGuard: No currentUser found'); // Ghi log thông báo không tìm thấy người dùng
      return false; // Trả về false vì không tìm thấy người dùng
    }

    const hasRole = this.roles.includes(String(currentUser.role)); // Kiểm tra xem người dùng có vai trò được yêu cầu không
    console.log('Has Role:', hasRole); // Ghi log kết quả kiểm tra vai trò của người dùng

    if (!error) { // Kiểm tra nếu không có lỗi
      console.log("error from role guard", error); // Ghi log lỗi từ phần guard
    }
    
    return hasRole; // Trả về kết quả kiểm tra vai trò của người dùng
  }
}
