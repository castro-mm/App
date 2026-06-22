import { sharedConfig } from '@/shared/config/shared.config';
import { Component, inject, input, output, signal } from '@angular/core';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ArquivoService } from '../../shared/services/arquivo.service';
import { ApiResponse } from '@/core/types/api-response.type';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-upload',
    imports: [...sharedConfig.imports],
    styles: [`
        .upload-dropzone {
            border: 2px dashed #ccc;
            border-radius: 6px;
            padding: 0.75rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.4rem;
            transition: border-color 0.2s, background 0.2s;
        }
        .upload-dropzone.dragover {
            border-color: var(--p-primary-color, #6366f1);
            background: rgba(99, 102, 241, 0.05);
        }
    `],
    template: `
        <div>
            @if (!disabled()) {
                <div
                    class="upload-dropzone"
                    [class.dragover]="isDragging()"
                    (dragover)="onDragOver($event)"
                    (dragleave)="onDragLeave($event)"
                    (drop)="onDrop($event)"
                >
                    <p-fileUpload
                        #fu
                        name="file"
                        mode="basic"
                        chooseLabel="Selecionar Arquivo"
                        [auto]="true"
                        [maxFileSize]="maxFileSize"
                        [accept]="acceptedFileTypes"
                        [customUpload]="true"
                        (uploadHandler)="onUpload($event)"
                        [disabled]="disabled()"
                    />
                    <small class="text-muted">ou arraste o arquivo aqui</small>
                </div>
            } @else {
                <p-fileUpload
                    #fu
                    name="file"
                    mode="basic"
                    chooseLabel="Selecionar Arquivo"
                    [auto]="true"
                    [maxFileSize]="maxFileSize"
                    [accept]="acceptedFileTypes"
                    [customUpload]="true"
                    (uploadHandler)="onUpload($event)"
                    [disabled]="disabled()"
                />
            }
            @if (uploading()) {
                <p-progressbar class="mt-2" mode="indeterminate" [style]="{'height': '5px'}" />
            }
        </div>
    `
})
/**
 * @author Marcelo M. de Castro
 * @summary Componente para upload de arquivos com suporte a tipos e tamanhos configuráveis, exibindo barra de progresso durante o envio.
 * @version 1.0.0
 */
export class UploadComponent {
    protected service = inject(ArquivoService);

    disabled = input<boolean>(false); 
    uploadResult = output<ApiResponse>();
    uploading = signal<boolean>(false);
    isDragging = signal<boolean>(false);

    maxFileSize: number = environment.file.maxFileSizeInBytes;
    acceptedFileTypes: string = environment.file.allowedFileTypes;

    constructor() { }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(true);
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.onUpload({ files: Array.from(files) } as FileUploadHandlerEvent);
        }
    }
    
    /**
     * @summary Manipula o evento de upload de arquivo, enviando o arquivo selecionado para o serviço de upload.
     * @param event Evento contendo os arquivos selecionados para upload.
     */
    onUpload(event: FileUploadHandlerEvent) {        
        this.uploading.set(true);
        this.service.upload(event.files[0])
            .then((response: ApiResponse) => {
                return this.uploadResult.emit(response)
            })
            .catch(error => this.onError(error))
            .finally(() => this.uploading.set(false));
    }

    /** 
     * @summary Manipula erros durante o upload de arquivos.
     * @param error Erro ocorrido durante o upload.
     */
    onError(error: any) {
        const apiError: ApiResponse = {
            statusCode: error?.status ?? 500,
            message: error?.error?.message ?? error?.message ?? 'Erro inesperado durante o upload.'
        };
        this.uploadResult.emit(apiError);
    }
}
