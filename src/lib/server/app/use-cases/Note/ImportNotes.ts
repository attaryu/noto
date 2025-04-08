import type { IExportBackupReturn } from './ExportNotes';

export interface IImportBackup {
	execute(backup: IExportBackupReturn, userId: string): Promise<void>;
}
