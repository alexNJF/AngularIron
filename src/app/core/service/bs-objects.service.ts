import { Injectable } from '@angular/core';

export type BsObject = {id: string, ref: any, data?: any};

@Injectable()
export class BsObjectsService {

  private objects: BsObject[] = [];

  all(): BsObject[] {
    return this.objects;
  }

  scope(prefix: string): BsObject[] {
    return this.all()
      .filter((object: BsObject) => object.id.indexOf(prefix) === 0);
  }

  getId(prefix: string, element: Element): string {
    const id: string | null = element.getAttribute('data-bs-id');
    if (!id?.trim()) throw new Error('invalid BsObject id');
    return `${prefix}-${id.trim()}`;
  }

  find(id: string): BsObject | undefined {
    return this.objects.find(w => w.id === id);
  }

  create(id: string, getRef: () => any, data: any = undefined): BsObject {
    const duplicated = this.objects.find(w => w.id === id);
    if (duplicated) throw new Error('duplicated BsObject id');
    const object: BsObject = {
      id,
      ref: getRef(),
      data
    };
    this.objects.push(object);
    return object;
  }

  destroy(prefix: string, id: string | null, action: (object: BsObject) => void): void {
    if (id) {
      const object = this.find(id);
      if (object) this.destroyAction(object, action);
      return;
    }
    this.objects
      .filter((object: BsObject) => object.id.indexOf(prefix) === 0)
      .forEach((object: BsObject) => this.destroyAction(object, action));
  }

  private destroyAction(object: BsObject, action: (object: BsObject) => void): void {
    action(object);
    this.objects = this.objects.filter(w => w.id !== object.id);
  }

  hoverDropdown(event: Event, prefix: string, container: HTMLElement): void {
    const trigger = container.querySelector('[data-bs-component="dropdown"]');
    if (!trigger) return;
    const id = this.getId(prefix, trigger);
    const dropdown: any = this.find(id)?.ref;
    if (!dropdown) return;
    if (event.type === 'mouseenter') dropdown.show();
    if (event.type === 'mouseleave') dropdown.hide();
  }

  hoverTooltip(event: Event, prefix: string, trigger: HTMLElement, getRef: () => any): void {
    const id = this.getId(prefix, trigger);
    let tooltip: any = this.find(id)?.ref;
    if (tooltip) this.destroy(prefix, id, (object: BsObject) => object.ref.dispose());
    tooltip = this.create(id, getRef).ref;
    if (event.type === 'mouseenter') tooltip.show();
  }
}
