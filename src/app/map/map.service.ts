import { ElementRef, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  getRTLTextPluginStatus,
  setRTLTextPlugin,
  MapOptions,
  RenderType,
  Map,
  NavigationControl,
  MarkerOptions,
  Marker
} from 'mapbox-gl';

@Injectable()
export class MapService {

  static loadRtlPlugin(): void {
    const status = getRTLTextPluginStatus();
    if (status === 'unavailable' || status === 'error') {
      setRTLTextPlugin('assets/scripts/mapbox-gl-rtl.js', undefined, true);
    }
  }

  async make(options: Partial<MapOptions>, renderType: RenderType = 'vector'): Promise<Map> {
    if (renderType === 'vector') MapService.loadRtlPlugin();
    const config: Partial<MapOptions> = await this.addBaseConfigToMapOptions(options, renderType);
    const navigationControl: NavigationControl = new NavigationControl({
      showZoom: true,
      showCompass: false,
      visualizePitch: false
    });
    const map: Map = new Map(config);
    map.addControl(navigationControl);
    return map;
  }

  createMarker(longitude: number, latitude: number, options?: Partial<MarkerOptions>): Marker {
    return new Marker(options)
      .setLngLat([longitude, latitude]);
  }

  private async addBaseConfigToMapOptions(
    options: Partial<MapOptions>,
    renderType: RenderType
  ): Promise<Partial<MapOptions>> {
    if (options.container instanceof ElementRef) {
      options.container = options.container.nativeElement as HTMLElement;
    }

    if (renderType === 'vector') {
      options.style = environment.mapIrVectorUrl;
    }
    if (renderType === 'raster') {
      options.style = {
        version: 8,
        sources: {
          raster: {
            type: 'raster',
            tiles: [environment.mapIrRasterUrl],
            tileSize: 256,
          }
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      };
    }

    options.transformRequest = (url: string) => {
      return {
        url,
        headers: {
          'x-api-key': environment.mapIrApiKey
        }
      };
    };

    return options;
  }
}
