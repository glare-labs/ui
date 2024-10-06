import { type SlotsType, defineComponent } from 'vue'
import { isServer } from '../../utils/is-server'
import { Ripple } from '../ripple/ripple'
import css from './styles/switch.module.scss'

class SwitchComponent {
    private readonly name = 'GlareUi-Switch'
    private readonly props = {
        disabled: {
            type: Boolean,
            default: false,
        },
        defaultSelected: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: Boolean,
            default: null,
        },
        withIcon: {
            type: Boolean,
            default: false,
        },
        withIconSelectedOnly: {
            type: Boolean,
            default: false,
        },
    }
    private readonly slots = {} as SlotsType<{
        'on-icon': void,
        'off-icon': void,
    }>
    private emits = [
        'update:modelValue',
        'change'
    ]

    public readonly component = defineComponent({
        name: this.name,
        props: this.props,
        slots: this.slots,
        emits: this.emits,
        created() {
            if (this.modelValue === null) {
                this.setSelected(this.defaultSelected)
            } else {
                this.selected = this.modelValue
            }
        },
        mounted() {
            if(isServer()) {
                return
            }
            (this.$el as Element).addEventListener('click', this.handleClick)
        },
        beforeUpdate() {
            if(this.modelValue !== null) {
                this.setSelected(this.modelValue)
            }
        },
        beforeUnmount() {
            (this.$el as Element).removeEventListener('click', this.handleClick)
        },
        data: () => ({
            selected: false
        }),
        methods: {
            setSelected(selected: boolean) {
                if(this.selected === selected) {
                    return
                }
                this.selected = selected
                this.$emit('update:modelValue', selected)
            },
            handleClick() {
                if (this.disabled) {
                    return
                }
                this.setSelected(!this.selected)
            }
        },

        render() {
            return (
                <span
                    class={[css.switch, this.disabled && css.disabled, this.selected ? css.selected : css.unselected]}
                    role="switch"
                    aria-disabled={this.disabled}
                    data-component="switch"
                >
                    <input
                        type="checkbox"
                        role="switch"
                        checked={this.selected}
                        disabled={this.disabled}
                        aria-disabled={this.disabled}
                    />

                    <span aria-hidden="true" class={css.background}></span >
                    <span aria-hidden="true" class={css.outline}></span >

                    <span class={css.track}>
                        <span class={css['handle-container']}>
                            <Ripple></Ripple>

                            <span class={[css.handle, (this.withIconSelectedOnly || this.withIcon) && css['with-icon']]}>
                                {
                                    (this.withIconSelectedOnly || this.withIcon) &&
                                    <div class={css.icons}>
                                        {
                                            this.selected && (this.$slots['on-icon'] ? this.$slots['on-icon']() : <SwitchOnIcon></SwitchOnIcon>)
                                        }
                                        {
                                            !this.withIconSelectedOnly && !this.selected && (this.$slots['off-icon'] ? this.$slots['off-icon']() : <SwitchOffIcon></SwitchOffIcon>)
                                        }
                                    </div>
                                }
                            </span>
                        </span>


                    </span>
                </span >
            )
        },
    })
}

export const Switch = new SwitchComponent().component

function SwitchOnIcon() {
    return (
        <div class={[css.icon, css['icon--on']]}>
            <svg viewBox="0 0 24 24">
                <path d="M9.55 18.2 3.65 12.3 5.275 10.675 9.55 14.95 18.725 5.775 20.35 7.4Z" />
            </svg>
        </div>
    )
}

function SwitchOffIcon() {
    return (
        <div class={[css.icon, css['icon--off']]}>
            <svg viewBox="0 0 24 24">
                <path
                    d="M6.4 19.2 4.8 17.6 10.4 12 4.8 6.4 6.4 4.8 12 10.4 17.6 4.8 19.2 6.4 13.6 12 19.2 17.6 17.6 19.2 12 13.6Z"
                />
            </svg>
        </div>
    )
}
