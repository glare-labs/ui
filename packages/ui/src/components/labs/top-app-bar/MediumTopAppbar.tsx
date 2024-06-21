import { type SlotsType, defineComponent } from 'vue'
import { type ISlotsShared, propsShared } from './base'
import css from './topAppbar.module.css'
import cssBase from './base.module.css'
import { Elevation } from '../../elevation/Elevation'

const props = propsShared
const slots = {} as SlotsType<Pick<ISlotsShared, 'leadingIcon'> & {
    trailingIcons: void
}>

export const MediumTopAppbar = defineComponent({
    props,
    slots,
    render() {
        const renderLeadingIcon = (
            <span class={cssBase['leading-icon']}>
                {this.$slots.leadingIcon && this.$slots.leadingIcon()}
            </span>
        )
        const renderTrailingIcons = (
            <span class={cssBase['trailing-icons']}>
                {this.$slots.trailingIcons && this.$slots.trailingIcons()}
            </span>
        )
        const renderTitle = <span class={cssBase.headline}>{this.headline}</span>
        const shadowMode = []
        
        if(this.alwaysShadow) {
            shadowMode.push(cssBase['always-shadow'])
        } else {
            if(this.onTopShadow) {
                shadowMode.push(cssBase['on-top-shadow'])
            }
            if(this.onScrollShadow) {
                shadowMode.push(cssBase['on-scroll-shadow'])
            }
        }

        return (
            <div
                data-is-top-app-bar="true"
                data-is-forced-sticky={this.forcedSticky}
                class={[cssBase.container, this.forcedSticky && cssBase['on-scroll'], css.medium, ...shadowMode]}
            >
                <div aria-hidden="true" class={cssBase.background}></div>
                <div aria-hidden="true" class={cssBase.outline}></div>

                <div class={cssBase['medium-grid']}>
                    {renderLeadingIcon}
                    {renderTrailingIcons}
                    {renderTitle}
                </div>

                <Elevation></Elevation>
            </div>
        )
    }
})
