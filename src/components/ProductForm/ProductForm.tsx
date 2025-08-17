import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ProductInputSchema, ProductInput, PRODUCT_CATEGORIES } from '@/types/product';
import { useProductStore } from '@/store/productStore';
import { StyledButton } from '@/components/common/Button';
import { Input, Select, FormGroup, Label, ErrorMessage, Textarea } from '@/components/common/Input';

interface ProductFormProps {
  onFormDataChange: (data: Partial<ProductInput>) => void;
  onDescriptionGenerated: (description: string) => void;
  generatedDescription?: string;
  onDescriptionChange?: (val: string) => void;
  onSave?: () => void;
}

const Form = styled.form`
  background: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  max-width: 600px;
  width: 100%;
`;

const FormTitle = styled.h2`
  font-size: ${theme.typography.fontSizes['2xl']};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.xl};
  text-align: center;
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  text-align: center;
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  &:hover { border-color: ${theme.colors.primary[400]}; background-color: ${theme.colors.primary[50]}; }
  &.has-image { border-color: ${theme.colors.success[500]}; background-color: ${theme.colors.success[50]}; }
`;

const ImagePreview = styled.div`
  margin-top: ${theme.spacing.md};
  img { max-width: 200px; max-height: 200px; border-radius: ${theme.borderRadius.md}; box-shadow: ${theme.shadows.md}; }
`;

const UploadButton = styled.label`
  display: inline-block; padding: ${theme.spacing.sm} ${theme.spacing.md};
  background-color: ${theme.colors.primary[600]}; color: white; border-radius: ${theme.borderRadius.md};
  cursor: pointer; font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium}; transition: all ${theme.transitions.normal};
  &:hover { background-color: ${theme.colors.primary[700]}; transform: translateY(-1px); }
  input[type="file"] { display: none; }
`;

const ButtonRow = styled.div`
  display: flex; gap: ${theme.spacing.md}; margin-top: ${theme.spacing.xl};
  @media (max-width: ${theme.breakpoints.sm}) { flex-direction: column; }
`;

const PriceInput = styled(Input)`
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  &[type=number] { -moz-appearance: textfield; }
`;

const BtnSpinner = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid ${theme.colors.primary[300]};
  border-top-color: ${theme.colors.primary[700]};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export const ProductForm: React.FC<ProductFormProps> = ({
  onFormDataChange,
  onDescriptionGenerated,
  generatedDescription,
  onDescriptionChange,
  onSave,
}) => {
  const { isGenerating, generateDescriptionForProduct } = useProductStore();
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [localGenerating, setLocalGenerating] = React.useState(false);

  const loading = isGenerating || localGenerating;


  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProductInput>({
    resolver: zodResolver(ProductInputSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: ''
    },
  });

  const title = watch('title');
  const category = watch('category');
  const price = watch('price');
  const imageFile = watch('imageFile');

  const watchedValues = watch();

  React.useEffect(() => {
    onFormDataChange({
      title: watchedValues.title || '',
      category: watchedValues.category || '',
      price: watchedValues.price,
      imageFile: watchedValues.imageFile,
    });
  }, [watchedValues.title, watchedValues.category, watchedValues.price, watchedValues.imageFile, onFormDataChange]);

  const handleGenerateDescription = async (data: ProductInput) => {
    try {
      setLocalGenerating(true);
      const aiResponse = await generateDescriptionForProduct(data);
      onDescriptionGenerated(aiResponse.description);
    } catch (error) {
      console.error('Failed to generate description:', error);
    } finally {
      setLocalGenerating(false);              
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('imageFile', file, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setValue('imageFile', file, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAndReset = async () => {
    await onSave?.();
  
    onDescriptionChange?.('');
  
    reset({ title: '', category: '', price: undefined, imageFile: undefined } as any);
  
    setImagePreview(null);
  };
  

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault();

  const canSave = !!generatedDescription?.trim() && !isGenerating;

  const canGenerate =
    !!title?.trim() &&
    !!category &&
    typeof price === 'number' &&
    Number.isFinite(price) &&
    !!imageFile;

  return (
    <Form onSubmit={handleSubmit(handleGenerateDescription)}>
      <FormTitle>Create New Product Listing</FormTitle>

      <FormGroup>
        <Label htmlFor="title">Product Title *</Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} id="title" value={field.value ?? ''} placeholder="Enter product title" error={!!errors.title} fullWidth />
          )}
        />
        {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">Category *</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select {...field} id="category" value={field.value ?? ''} error={!!errors.category} fullWidth>
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          )}
        />
        {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="price">Price *</Label>
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <PriceInput
              {...field}
              type="number"
              step="0.01"
              min="0"
              id="price"
              placeholder="0.00"
              error={!!errors.price}
              fullWidth
              value={Number.isFinite(field.value as number) ? (field.value as number) : ''}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') field.onChange(undefined);
                else field.onChange(parseFloat(v));
              }}
            />
          )}
        />
        {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
      </FormGroup>

      <FormGroup>
        <Label>Product Image *</Label>
        <ImageUploadContainer
          className={imagePreview ? 'has-image' : ''}
          onDrop={handleImageDrop}
          onDragOver={handleDragOver}
        >
          <p style={{ color: theme.colors.gray[600], marginBottom: theme.spacing.sm }}>
            {imagePreview
              ? 'Image uploaded successfully! Click to change or drag a new image here.'
              : 'Drag and drop an image here, or click to browse'}
          </p>

          <UploadButton>
            Choose Image
            <input type="file" accept="image/*" onChange={handleImageChange} aria-label="Upload product image" />
          </UploadButton>

          {imagePreview && (
            <ImagePreview>
              <img src={imagePreview} alt="Product preview" aria-label="Product image preview" />
            </ImagePreview>
          )}
        </ImageUploadContainer>
        {errors.imageFile && <ErrorMessage>{errors.imageFile.message}</ErrorMessage>}
      </FormGroup>

      {/* CTA row */}
      <ButtonRow>
        <StyledButton
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canGenerate || loading}
          aria-busy={loading}
        >
          {loading ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <BtnSpinner aria-hidden="true" />
              Generating Description…
            </span>
          ) : (
            'Generate Description'
          )}
        </StyledButton>


        {canSave && onSave && (
          <StyledButton variant="secondary" size="lg" fullWidth onClick={handleSaveAndReset}>
            Save Listing
          </StyledButton>
        )}
      </ButtonRow>

      {generatedDescription !== undefined && generatedDescription !== '' && (
        <FormGroup style={{ marginTop: theme.spacing.xl }}>
          <Label htmlFor="desc">Edit Description</Label>
          <Textarea
            id="desc"
            value={generatedDescription ?? ''}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            placeholder="Type or refine the description here…"
            style={{ minHeight: 140 }}
            fullWidth
          />
        </FormGroup>
      )}
    </Form>
  );
};
