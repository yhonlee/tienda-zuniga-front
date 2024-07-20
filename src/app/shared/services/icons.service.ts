import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Icons } from '../enums/icons.enum';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  public registerIcons(): void {
    this.load(Icons, this.checkEnvironment());
  }

  private load(icons: any, url: string): void {
    Object.keys(icons).forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${url}/${icons[icon]}.svg`)
      );
    });
  }

  private checkEnvironment(): string {
    return false ? `localhost:4200/assets/icons` : `assets/icons`;
  }
}
