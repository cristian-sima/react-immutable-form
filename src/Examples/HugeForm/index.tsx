/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
// import { JSONSyntaxFromData } from "Sidenote/Common/Syntax";

import { JSONSyntaxFromData } from "Sidenote/core/Common/Syntax";
import { FormPrompt } from "Sidenote/core/store/store";
import Immutable, { List } from "immutable";
import React, { useCallback, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { LoadingMessage } from "x25/Messages";
import { notify, notifyError, notifyWarning } from "x25/actions";
import { validateDate, validateFloat, validateSelect } from "x25/utility";
import { ImmutableField, ImmutableFieldRenderer, ImmutableForm, ImmutableFormArray, ImmutableFormContext, immutableGetters } from "../..";
import { onErrors } from "../../../src";
import { HandleChangeFunc, ImmutableFieldProps, ImmutableFormDecorators, RemoveArrayFunc, onSubmitImmutableFormErrorFunc, onSubmitImmutableFormFunc } from "../../types";

type TableRowProps = {
  readonly current: Immutable.Map<string, any>;
  readonly ID: string;
  readonly index: number;
  readonly listName: string;
  readonly remove: RemoveArrayFunc;
}

type FormInnerProps = {
  readonly formError: string;
  readonly isSubmitting: boolean;
  readonly hide: boolean; 
  readonly nameInput: React.RefObject<HTMLInputElement>;
  readonly formState: Immutable.Map<string, any>
  readonly setField: HandleChangeFunc;
  readonly focus: () => any;
  readonly toggle: () => any;
  readonly toggleJSONSource: () => any;
}

const 

  isFloat = (raw: string) => {
    const floatRegex = /^-?\d+(?:[.]\d*?)?$/u;

    return floatRegex.test(raw);
  },
  isNumeric = (valueToCheck : any) => (
    valueToCheck !== "" && isFloat(valueToCheck) && typeof valueToCheck === "string"
  ),
  NR_OF_ROWS = 400,
  itemsListName = "Items",
  TableDetails = () => {
    const
      { handleArrayAdd, formState } = useContext(ImmutableFormContext);

    return (
      <>
        <span className="badge text-bg-primary">
          {"Items: "}
          { (formState.getIn([itemsListName]) as any).size as number }
        </span>
        <button
          className="btn btn-success ms-1"
          onClick={() => handleArrayAdd(itemsListName, Immutable.Map({
            Name    : "cristina",
            Surname : "water",
          }))}
          type="button">
          {"+"}
        </button>
      </>
    );
  },
  TableRowInner = ({ ID, index, listName, remove }: TableRowProps) => {
    const 
      renderCount = useRef(0),
      rowProps = React.useMemo(() => ({
        listName,
        ID,
        index,
      } as ImmutableFieldProps<HTMLInputElement>), [ID, listName, index]);

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <tr key={ID}>
        <td key={`td-${ID}-nume`}>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Name"
          />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Surname" />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Age" />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="Location" />
        </td>
        <td>
          <ImmutableField
            {...rowProps}
            component={ImmutableFieldRenderer}
            name="city" />
        </td>
        <td>
          <span className="badge text-bg-warning">{renderCount.current}</span>
          <button
            className="btn btn-danger"
            onClick={() => remove(listName, ID)}
            type="button">
            {"x"}
          </button>
        </td>
      </tr>
    );
  },
  TableRow = React.memo(TableRowInner),
  ItemsInner = () => (
    <ImmutableFormArray name={itemsListName}>
      {({ data, name: listName, remove }) => (
        <table>
          <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Surname
              </th>
              <th>
              Age
              </th>
              <th>
              Location
              </th>
              <th>
              City
              </th>
            </tr>
          </thead>
          {/* <TransitionGroup component="tbody"> */}
          <tbody>
            {data.map((current, index) => {
              if (typeof current === "undefined") {
                return null;
              }
                
              const ID = current.get("ID");

              return (
                <TableRow
                  current={current}
                  ID={ID}
                  index={index}
                  key={ID}
                  listName={listName}
                  remove={remove} />
              );
            })}
          </tbody>
          {/* </TransitionGroup> */}
        </table>
      )}
    </ImmutableFormArray>
  ),
  Items = React.memo(ItemsInner),
  FormInner = (props : FormInnerProps) => {

    const 
      { formError, isSubmitting } = props;

    return (
      <>
        {formError ? (
          <div className="alert alert-danger">
            {formError}
          </div>
        ) : null}
        {isSubmitting ? <LoadingMessage message="Simulating server response..." /> : (
          <div className="container">
            <div className="row">
              <div className="col-auto">
                <div className="alert alert-secondary m-3 p-3">
                  {`The form has ${NR_OF_ROWS} rows, with ${5*NR_OF_ROWS} fields!`}
                </div>

              </div>
              <div
                className="col" style={{
                  width: "100%",
                }}>
                
                <TableDetails />
                <Items />
              </div>
              <div className="col-6 text-center mt-3">
                <button
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  type="submit">
                  {"Submit form"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
  InnerRenderSum = ({ data } : { readonly data : any}) => (
    <div>
      {"Total: "}
      <JSONSyntaxFromData data={data} />
    </div>
  ),
  RenderSum = React.memo(InnerRenderSum),
  ShowSum = () => {
    const 
      form = useContext(ImmutableFormContext);

    return (
      <RenderSum data={form.getFormData().get("computed")} />
    );
  },
  HugeForm = () => {
    const      
      initialValues = Immutable.fromJS({
        Total           : "1",
        Vat             : "1",
        [itemsListName] : List(Array(NR_OF_ROWS).fill("").map((_value, index) => Immutable.Map({
          Name    : "Nea",
          Surname : `Caisa ${index}`,
        }))),
      }),

      atLeastChars = (nrOfChars :number) => (
        (value: any) => {
        // const paraschiv = formState.getIn(["paraschiv", "value"]);
    
          if (typeof value !== "string" || String(value).length < nrOfChars ) {
            return `At least ${nrOfChars} chars`;
          }
    
          return undefined;
        }
      ),
      initialValidators = Immutable.Map({
        "AnimalID"  : validateSelect({}),
        "IsDeleted" : (value : any) => value === true ? undefined : "Must check this",
        "CarDate"   : validateDate,
        "TaxTotal"  : validateFloat({
          min : 200,
          max : 10000,
        }),
        "Total" : atLeastChars(3),
        "City"  : (value : any) => (
          String(value).includes(",") ? undefined : "It must include a comma (,)"
        ),
        "Vat": (value : any) => {
          const 
            acceptedList = [5, 9, 19],
            isOk = acceptedList.includes(Number(value));

          if (isOk) {
            return undefined;
          }

          return `Must be ${acceptedList.join(" or ")}`;
        },
        [itemsListName]: Immutable.Map(
          {
            "Name"    : atLeastChars(3),
            "Surname" : atLeastChars(7),
            // "age"     : atLeastChars(2),
          },
        ),
      }),
      dispatch = useDispatch(),
      onSubmit : onSubmitImmutableFormFunc  = (values) => 
      {
        // eslint-disable-next-line no-console
        console.log("values.toJS()", values.toJS());


        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              if (Math.random() < 0.3) {
                throw new Error("Simulated network error");
              }
              dispatch(notify("Simulated confirmation. The form was ok!"));
              resolve();
            } catch (error) {
              dispatch(notifyError("Simulated server error"));
              reject(error);
            }
          }, 2000);
        });
      },
      onSubmitError : onSubmitImmutableFormErrorFunc = useCallback((errors) => {
        const cb = (node : any) => dispatch(notifyWarning(node, { persistent: true }));
  
        return onErrors(cb)(errors);
      }, []),
      decorators : ImmutableFormDecorators = Immutable.Map({
        "Items.Age": ({ formData, nodes }) => {
          
          // console.group("Items.Age");
          // console.log("field", field);
          // console.log("formData", formData);
          // console.log("nodes", nodes);
          // console.log("value", value);
          // console.groupEnd("Items.Age");

          // todo create a special helper for iterating array 

          const 
            sumAges = () => {
              const 
                listName = String(nodes.first()),
                list = immutableGetters.getArray(formData, listName),
                newValue = list.reduce((reduction, row) => {
                  const
                    currentAge =  immutableGetters.getArrayRowFieldValue(row, "Age"),
                    numericAge = isNumeric(currentAge) ? parseFloat(String(currentAge)) : 0;

                  formData.updateIn(
                    ["computed", ...nodes, "NewAge"], 
                    (newAge : any = 0) => (newAge + 10) as any,
                  );

                  return reduction + numericAge;
                }, 0);

              return newValue;
            };
            
          formData.setIn(["computed", "sum"], sumAges());
        },
      });

    return (
      <ImmutableForm
        decorators={decorators}
        initialValidators={initialValidators}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}>
        {(form) => {
          const 
            [ hide, setHide ] = React.useState(false),
            nameInput = useRef<HTMLInputElement>(null),
            [ source, setSource ] = React.useState("management"),
        
            formError = form.management.get("formError"),
            isSubmitting = form.management.get("isSubmitting"),
            isDirty = form.management.get("dirtyFields")?.size !== 0,
        
            toggleJSONSource = () => {
              setSource((
                source === "management" ? "formState" : "management"
              ));
            },
            toggle= () => setHide(!hide),
            focus = () => {
              if (nameInput && nameInput.current) {
                nameInput.current.focus();
              }
            };
        
          return (
            <div className="container">
              <div className="row">
                <div className="col">
                  <form onSubmit={form.handleSubmit}>
                    <FormPrompt dirty={isDirty} />
                    <FormInner 
                      focus={focus}
                      formError={formError}
                      formState={form.formState}
                      hide={hide}
                      isSubmitting={isSubmitting}
                      nameInput={nameInput}
                      setField={form.handleChange}
                      toggle={toggle}
                      toggleJSONSource={toggleJSONSource}
                    /> 
                    <ShowSum />     
                  </form>
                </div>
              </div>
            </div>
          );
        }}
      </ImmutableForm>
    );
  };

export default HugeForm;
