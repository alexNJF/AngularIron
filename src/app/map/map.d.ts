// TODO: Complete this declaration file: https://github.com/mapbox/mapbox-gl-js/tree/v1.9.1/src
declare module 'mapbox-gl' {
  import { ElementRef } from '@angular/core';

  export type RenderType = 'vector' | 'raster';

  export function setRTLTextPlugin(url: string, errorCallback?: (error?: Error) => void, deferred?: boolean): void;
  export function getRTLTextPluginStatus(): 'unavailable' | 'error' | 'deferred' | 'loading' | 'loaded';

  export enum ResourceType {
    Unknown = 'Unknown',
    Style = 'Style',
    Source = 'Source',
    Tile = 'Tile',
    Glyphs = 'Glyphs',
    SpriteImage = 'SpriteImage',
    SpriteJSON = 'SpriteJSON',
    Image = 'Image'
  }
  export interface RequestParameters {
    url: string;
    headers?: Object;
    method?: 'GET' | 'POST' | 'PUT';
    body?: string;
    type?: 'string' | 'json' | 'arrayBuffer';
    credentials?: 'same-origin' | 'include';
    collectResourceTiming?: boolean;
  }
  export type RequestTransformFunction = (url: string, resourceType?: ResourceType) => RequestParameters;
  export type ControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  export type MapEvent = 'mousedown' | 'mouseup' | 'mouseover' | 'mousemove' | 'click'
    | 'dblclick' | 'mouseenter' | 'mouseleave' | 'mouseout' | 'contextmenu'
    | 'wheel' | 'touchstart' | 'touchend' | 'touchmove' | 'touchcancel'
    | 'movestart' | 'move' | 'moveend' | 'dragstart' | 'drag'
    | 'dragend' | 'zoomstart' | 'zoom' | 'zoomend' | 'rotatestart'
    | 'rotate' | 'rotateend' | 'pitchstart' | 'pitch' | 'pitchend'
    | 'boxzoomstart' | 'boxzoomend' | 'boxzoomcancel' | 'resize' | 'webglcontextlost'
    | 'webglcontextrestored' | 'load' | 'render' | 'idle' | 'remove'
    | 'error' | 'data' | 'styledata' | 'sourcedata' | 'dataloading'
    | 'styledataloading' | 'sourcedataloading' | 'styleimagemissing' | 'style.load';
  export interface IControl {
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }
  export interface MapOptions {
    hash: boolean | string;
    interactive: boolean;
    container: ElementRef | HTMLElement | string;
    style: Object | string;
    bearingSnap: number;
    attributionControl: boolean;
    customAttribution: string | string[];
    logoPosition: ControlPosition;
    failIfMajorPerformanceCaveat: boolean;
    preserveDrawingBuffer: boolean;
    antialias: boolean;
    refreshExpiredTiles: boolean;
    maxBounds: any; // LngLatBoundsLike
    scrollZoom: boolean;
    minZoom: number;
    maxZoom: number;
    minPitch: number;
    maxPitch: number;
    boxZoom: boolean;
    dragRotate: boolean;
    dragPan: any; // DragPanOptions
    keyboard: boolean;
    doubleClickZoom: boolean;
    touchZoomRotate: boolean;
    trackResize: boolean;
    center: number[]; // LngLatLike
    zoom: number;
    bearing: number;
    pitch: number;
    renderWorldCopies: boolean;
    maxTileCacheSize: number;
    transformRequest: RequestTransformFunction;
    accessToken: string;
    locale: Object;
  }
  export interface MarkerOptions {
    element: HTMLElement;
    offset: any; // PointLike;
    anchor: any; // Anchor;
    color: string;
    draggable: boolean;
    rotation: number;
    rotationAlignment: string;
    pitchAlignment: string;
  }
  export interface NavigationControlOptions {
    showCompass: boolean;
    showZoom: boolean;
    visualizePitch: boolean;
  }
  export class Map {
    constructor(options: Partial<MapOptions>);
    on(type: MapEvent, layerIdOrListener: string | ((event: any) => void), listener?: (event: any) => void): Map;
    addControl(control: IControl, position?: ControlPosition): Map;
    remove(): void;
  }
  export class Marker {
    constructor(options?: Partial<MarkerOptions>);
    // TODO: coords: LngLatLike
    setLngLat(coords: number[]): Marker;
    addTo(map: Map): Marker;
    remove(): Marker;
  }
  export class NavigationControl implements IControl {
    constructor(options?: Partial<NavigationControlOptions>);
    onAdd(map: Map): HTMLElement;
    onRemove(map: Map): void;
  }
}
