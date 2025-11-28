// styleUtils.ts
export const formatUnit = (value: string | null | undefined, unit: string) =>
  value ? `${value}${unit === 'percent' ? '%' : unit}` : undefined

export const inlineStyles = (props: {
  backgroundColor?: string
  textColor?: string
  paddingValue?: string | null
  paddingUnit?: string
  paddingTop?: string | null
  paddingBottom?: string | null
  paddingLeft?: string | null
  paddingRight?: string | null
  marginValue?: string | null
  marginUnit?: string
  marginTop?: string | null
  marginBottom?: string | null
  marginLeft?: string | null
  marginRight?: string | null
  borderRadiusValue?: string | null
  borderRadiusUnit?: string
  heightValue?: string | null
  heightUnit?: string
  widthValue?: string | null
  widthUnit?: string
}): React.CSSProperties => {
  return {
    ...(props.backgroundColor && { backgroundColor: props.backgroundColor }),
    ...(props.textColor && { color: props.textColor }),
    ...(props.paddingValue && props.paddingUnit && { padding: formatUnit(props.paddingValue, props.paddingUnit) }),
    ...(props.paddingTop && props.paddingUnit && { paddingTop: formatUnit(props.paddingTop, props.paddingUnit) }),
    ...(props.paddingBottom && props.paddingUnit && { paddingBottom: formatUnit(props.paddingBottom, props.paddingUnit) }),
    ...(props.paddingLeft && props.paddingUnit && { paddingLeft: formatUnit(props.paddingLeft, props.paddingUnit) }),
    ...(props.paddingRight && props.paddingUnit && { paddingRight: formatUnit(props.paddingRight, props.paddingUnit) }),
    ...(props.marginValue && props.marginUnit && { margin: formatUnit(props.marginValue, props.marginUnit) }),
    ...(props.marginTop && props.marginUnit && { marginTop: formatUnit(props.marginTop, props.marginUnit) }),
    ...(props.marginBottom && props.marginUnit && { marginBottom: formatUnit(props.marginBottom, props.marginUnit) }),
    ...(props.marginLeft && props.marginUnit && { marginLeft: formatUnit(props.marginLeft, props.marginUnit) }),
    ...(props.marginRight && props.marginUnit && { marginRight: formatUnit(props.marginRight, props.marginUnit) }),
    ...(props.borderRadiusValue && props.borderRadiusUnit && { borderRadius: formatUnit(props.borderRadiusValue, props.borderRadiusUnit) }),
    ...(props.heightValue && props.heightUnit && { height: formatUnit(props.heightValue, props.heightUnit) }),
    ...(props.widthValue && props.widthUnit && { width: formatUnit(props.widthValue, props.widthUnit) }),
  }
}
