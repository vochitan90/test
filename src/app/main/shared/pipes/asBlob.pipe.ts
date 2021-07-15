import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({ name: 'asBlob', pure: false })
export class AsBlobPipe implements PipeTransform {
  constructor(private _httpClient: HttpClient, private _sanitizer: DomSanitizer) {
  }

  transform(url: string): Observable<SafeUrl> {
    return this._httpClient
      .get(url, { responseType: 'blob' })
      .pipe(
        map(data => this._sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(data)))
      );
  }
}
