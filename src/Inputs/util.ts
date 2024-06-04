export const 
  TEMPLATES_CLASSES = {
    LEFT  : "col-md-4 text-md-end",
    RIGHT : "col-md-8",
  },
  getTemplateInfo = (componentProps : Immutable.Map<string, any>) => {
    const 
      leftPart = componentProps && componentProps.get("left") || TEMPLATES_CLASSES.LEFT,
      rightPart = componentProps && componentProps.get("right") || TEMPLATES_CLASSES.RIGHT;

    return ({
      label      : componentProps && componentProps.get("label"),
      leftClass  : `${leftPart} form-control-label align-self-center` ,
      rightClass : `${rightPart} align-self-center` ,
    });
  };