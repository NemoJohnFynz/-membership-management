import { DynamicModule, Global, Module } from '@nestjs/common';
import { GoogleDriveConfig } from './Types/googleDriveConfig';
import { GoogleDriveModuleAsyncOptions } from './Types/googleDrive.module.async.interface';
import { googleDriveFolderId } from './DriveF.folderid';
import { GoogleDriveService } from './googleDrive.service';

@Module({})
export class GoogleDriveModule {
  /**
   * @param googleDriveConfig  GoogleDriveConfig
   * @param googleDriveFolderId googleDriveFolderId
   */
  static register(
    googleDriveConfig: GoogleDriveConfig,
    googleDriveFolderId: googleDriveFolderId ,
  ): DynamicModule {
    return {
      module: GoogleDriveModule,
      global: true,
      providers: [
        GoogleDriveService,
        { provide: 'CONFIG', useValue: googleDriveConfig },
        { provide: 'FOLDERID', useValue: googleDriveFolderId },
      ],
      exports: [
        GoogleDriveService,
        { provide: 'CONFIG', useValue: googleDriveConfig },
        { provide: 'FOLDERID', useValue: googleDriveFolderId },
      ],
    };
  }


  static registerAsync(options: GoogleDriveModuleAsyncOptions): DynamicModule {
    return {
      module: GoogleDriveModule,
      global: true,
      imports: options.imports,
      providers: [
        GoogleDriveService,
        {
          provide: 'CONFIG',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      
      exports: [GoogleDriveService]
    };
    
  }
  
}