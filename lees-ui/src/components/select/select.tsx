import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import styled from "styled-components";

type DataType = any;

type SelectContextType = {
  open: boolean;
  onChange: (id: unknown) => void;
  selectedValue: DataType;
  selectedLabel: DataType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedValue: React.Dispatch<React.SetStateAction<DataType>>;
  setSelectedLabel: React.Dispatch<React.SetStateAction<DataType>>;
};

type SelectProps = {
  id?: string;
  className?: string;
  value?: DataType; //string | number;
  onChange?: any;
  children?: React.ReactNode;
  required?: boolean;
};

type DefaultProps = {
  id?: string;
  className?: string;
  children?: React.ReactNode;
};

type OptionProps = {
  value: string | number;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export const Select = ({
  id,
  className,
  value,
  children,
  onChange,
  required,
}: SelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<DataType>();
  const [selectedLabel, setSelectedLabel] = useState<DataType>();

  useEffect(() => {
    value !== undefined && setSelectedValue(value);
  }, [value]);

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        onChange,
        selectedValue,
        selectedLabel,
        setSelectedValue,
        setSelectedLabel,
      }}
    >
      <SelectBoxWrapper id={id} className={className}>
        {children}
      </SelectBoxWrapper>
    </SelectContext.Provider>
  );
};

const Trigger = ({ className, id, children }: DefaultProps) => {
  const ref = useRef<any>();
  const { selectedLabel, open, setOpen } = useContext(
    SelectContext
  ) as SelectContextType;

  const onClickOutside = (e: any) => e.target !== ref.current && setOpen(false);

  useEffect(() => {
    window.addEventListener("click", onClickOutside);
    return () => window.removeEventListener("click", onClickOutside);
  });

  return (
    <>
      <SelectBox
        ref={ref}
        id={id}
        className={className}
        open={open}
        onClick={() => {
          setOpen(!open);
        }}
      >
        {selectedLabel}
        {children}
      </SelectBox>
    </>
  );
};
const OptionWrapper = ({
  id,
  children,
  className,
}: {
  children: React.ReactNode;
} & DefaultProps) => {
  const { open } = useContext(SelectContext) as SelectContextType;

  return (
    <>
      <SelectOptionWrapper open={open} id={id} className={className}>
        {children}
      </SelectOptionWrapper>
    </>
  );
};

const Option = ({ value, children, ...props }: OptionProps) => {
  const {
    selectedValue,
    setSelectedValue,
    setSelectedLabel,
    setOpen,
    onChange,
  } = useContext(SelectContext) as SelectContextType;

  useEffect(() => {
    if (value === selectedValue) {
      setSelectedLabel(children);
    }
  }, [value, selectedValue, setSelectedLabel, children]);

  const onClickOption = () => {
    if (typeof children === "string" || typeof children === "number") {
      setSelectedValue(value);
      onChange(value);
      setOpen(false);
    }
  };

  return (
    <SelectOption onClick={onClickOption} {...props}>
      {children}
    </SelectOption>
  );
};

Select.Trigger = Trigger;
Select.OptionWrapper = OptionWrapper;
Select.Option = Option;

const SelectBoxWrapper = styled.div`
  position: relative;
  padding: 0;
  cursor: pointer;
`;
const SelectBox = styled.button<{ open: boolean }>`
  width: 100%;
  outline: none;
  cursor: pointer;
  text-align: left;
`;

const SelectOptionWrapper = styled.div<{ open: boolean }>`
  margin-top: 0.2rem;
  position: absolute;
  width: 100%;
  overflow: hidden;
  visibility: ${(props) => (props.open ? "visible" : "hidden")};
  opacity: ${(props) => (props.open ? "1" : "0")};
  transition: all 0.1s;
`;

const SelectOption = styled.p`
  position: relative;
`;
