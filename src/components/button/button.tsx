import {
  Component,
  Prop,
  h,
  ComponentInterface,
  Event,
  EventEmitter,
  Host
} from "@stencil/core";
import { ButtonTheme, ButtonSize } from "./button.types";

@Component({
  tag: "tg-button",
  styleUrl: "button.scss",
  shadow: true
})
export class Button implements ComponentInterface {
  private internalBtn!: HTMLButtonElement;
  private activeRipple: Promise<() => void> | undefined;

  /**
   * Sets disabled status
   */
  @Prop({ attr: "disabled", reflectToAttr: true }) isDisabled: boolean;

  /**
   * Sets button size
   */
  @Prop({ reflectToAttr: true }) size: ButtonSize = "medium";

  /**
   * Sets the theme
   */
  @Prop() theme: ButtonTheme = "yellow";

  @Event() tgClick: EventEmitter;
  @Event() tgHover: EventEmitter;
  @Event() tgFocus: EventEmitter;

  componentDidLoad() {
    this.internalBtn.onmousedown = this.addRippleEffectForMouse;
    this.internalBtn.onmouseup = this.removeRipple;
    this.internalBtn.onmouseleave = this.removeRipple;
  }

  private addRippleEffectForMouse = (event: MouseEvent) => {
    this.addRippleEffect(event.clientX, event.clientY);
  };

  private removeRipple = () => {
    if (this.activeRipple !== undefined) {
      this.activeRipple.then(remove => remove());
      this.activeRipple = undefined;
    }
  };

  private addRippleEffect(clientX: number, clientY: number): void {
    const rippleEffectComponent = this.internalBtn!.querySelector(
      "tg-ripple-effect"
    );
    if (rippleEffectComponent) {
      this.removeRipple();

      this.activeRipple = rippleEffectComponent.addRipple(clientX, clientY);
    }
  }

  private onButtonClick = (e: MouseEvent) => {
    this.tgClick.emit(e);
  };
  private onButtonHover = (e: MouseEvent) => {
    this.tgHover.emit(e);
  };
  private onButtonFocus = (e: MouseEvent) => {
    this.tgFocus.emit(e);
  };

  render() {
    const btnClasses = {
      btn: true,
      ["btn--" + this.theme]: true
    };
    const attrs = {
      onclick: this.onButtonClick,
      onfocus: this.onButtonFocus,
      onmouseover: this.onButtonHover,
      disabled: this.isDisabled,
      class: btnClasses
    };
    return (
      <Host>
        <button
          {...attrs}
          ref={el => (this.internalBtn = el as HTMLButtonElement)}
        >
          <slot>Button</slot>
          <tg-ripple-effect type="bounded" />
        </button>
      </Host>
    );
  }
}
