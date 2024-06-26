import { defineComponent, type PropType, type SlotsType } from 'vue'
import tabCss from '../navigation-tab/styles/navigation-tab.module.scss'
import css from './styles/navigation-bar.module.scss'

export interface INavigationBarProvider {
    currentActiveIndex: number | null
}

export type TNavigationBarPosition = 'left' | 'center' | 'right'
export const SNavigationBarProvider = Symbol()

export const enum ENavigationBarPosition {
    Left = 'left',
    Center = 'center',
    Right = 'right',
}

class NavigationBarComponent {
    private name = `GlareUi-NavigationBar`
    private props = {
        defaultActiveIndex: {
            type: Number,
            default: null,
        },
        modelValue: {
            type: Number,
            default: null,
        },
        position: {
            type: String as PropType<TNavigationBarPosition>,
            default: ENavigationBarPosition.Center,
        },
    }
    private slots = {} as SlotsType<{
        default: void
    }>
    private emits = ['update:modelValue']

    public component = defineComponent({
        name: this.name,
        props: this.props,
        slots: this.slots,
        emits: this.emits,
        provide() {
            return ({
                [SNavigationBarProvider]: {
                    currentActiveIndex: this.activeIndex,
                }
            })
        },
        watch: {
            activeIndex(val) {
                this.$emit('update:modelValue', val)
            },
        },
        data(vm) {
            return ({
                activeIndex: null as null | number,
                activeElement: null as HTMLElement | null,
            })
        },
        created() {
            if (this.defaultActiveIndex !== null) this.$emit('update:modelValue', this.defaultActiveIndex)
            if (this.defaultActiveIndex !== null && this.modelValue !== null) console.warn('When defaultActiveIndex and v-model are provided at the same time, the value of v-model will be replaced by defaultActiveIndex.')
        },
        mounted() {
            /**
             * Get all the children that masked 'data-is-tab', count the children and set id and click event to it.
             * 
             */
            const el = (this.$el) as HTMLElement
            const children = [...el.children].filter(e => e.getAttribute('data-is-tab') !== null) as Array<HTMLElement>
    
            children.map((e, i) => {
                e.setAttribute('data-tab-id', i.toString())
                e.addEventListener('click', (e: Event) => {
                    const element = e.currentTarget as HTMLElement
                    const elementId = element.getAttribute('data-tab-id')
                    if (elementId === null) throw new Error('NO ID FOUND')
                    this.activeIndex = parseInt(elementId)
                    this.activeElement?.classList.remove(tabCss.active)
                    this.activeElement = element
                    this.activeElement.classList.add(tabCss.active)
                }, true)
            })
        },

        render() {
            return (
                <div
                    data-component="navigation-bar"
                    class={[css['navigation-bar']]}
                    ref="barRef"
                >
                    {this.$slots.default && this.$slots.default()}
                </div>
            )
        }
    })
}

export const NavigationBar = new NavigationBarComponent().component
