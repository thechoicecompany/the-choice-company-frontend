import {
    useState,
    useCallback,
    useRef,
} from "react";

import {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    reorderBanners,
    uploadBannerImage,
} from "@/lib/api/admin/heroBanners";

import {
    EMPTY_FORM_VALUES,
    type HeroBanner,
    type BannerFormValues,
} from "@/lib/types/heroBanner.types";

export function useHeroBanners() {
    const [banners, setBanners] = useState<HeroBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [formValues, setFormValues] =
        useState<BannerFormValues>(EMPTY_FORM_VALUES);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [saving, setSaving] = useState(false);
    const [formOpen, setFormOpen] = useState(false);

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [imagePreview, setImagePreview] = useState("");

    const objectUrlRef =
        useRef<string | null>(null);

    const [draggingIndex, setDraggingIndex] =
        useState<number | null>(null);

    const preDragOrderRef =
        useRef<HeroBanner[] | null>(null);

    // ── Load banners ─────────────────────────────────────────────────────────

    const load = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await getAllBanners();

            // Always keep banners as an array.
            setBanners(
                Array.isArray(data) ? data : []
            );
        } catch (e: unknown) {
            // Prevent undefined/null state after an API failure.
            setBanners([]);

            setError(
                e instanceof Error
                    ? e.message
                    : "Failed to load banners"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Image preview cleanup ────────────────────────────────────────────────

    const releasePreviewUrl = useCallback(() => {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(
                objectUrlRef.current
            );

            objectUrlRef.current = null;
        }
    }, []);

    // ── Create form ──────────────────────────────────────────────────────────

    const openCreateForm = useCallback(
        (currentCount: number) => {
            releasePreviewUrl();

            setEditingId(null);

            setFormValues({
                ...EMPTY_FORM_VALUES,
                displayOrder: currentCount,
            });

            setImageFile(null);
            setImagePreview("");
            setError("");
            setFormOpen(true);
        },
        [releasePreviewUrl]
    );

    // ── Edit form ────────────────────────────────────────────────────────────

    const openEditForm = useCallback(
        (banner: HeroBanner) => {
            releasePreviewUrl();

            setEditingId(banner.id);

            setFormValues({
                tag: banner.tag,
                headlineTop: banner.headlineTop,
                headlineBottom: banner.headlineBottom,
                body: banner.body,
                ctaLabel: banner.ctaLabel ?? "",
                ctaLink: banner.ctaLink ?? "",
                displayOrder: banner.displayOrder,
                active: banner.active,
                imageUrl: banner.imageUrl,
                imagePublicId: banner.imagePublicId,
            });

            setImageFile(null);
            setImagePreview(banner.imageUrl);
            setError("");
            setFormOpen(true);
        },
        [releasePreviewUrl]
    );

    // ── Close form ───────────────────────────────────────────────────────────

    const closeForm = useCallback(() => {
        releasePreviewUrl();

        setEditingId(null);
        setFormValues(EMPTY_FORM_VALUES);
        setImageFile(null);
        setImagePreview("");
        setError("");
        setFormOpen(false);
    }, [releasePreviewUrl]);

    // ── Form field update ────────────────────────────────────────────────────

    const updateField = useCallback(
        <K extends keyof BannerFormValues>(
            key: K,
            value: BannerFormValues[K]
        ) => {
            setFormValues((prev) => ({
                ...prev,
                [key]: value,
            }));
        },
        []
    );

    // ── Image selection ──────────────────────────────────────────────────────

    const handleImageSelected = useCallback(
        (file: File) => {
            releasePreviewUrl();

            const url = URL.createObjectURL(file);

            objectUrlRef.current = url;

            setImageFile(file);
            setImagePreview(url);
            setError("");
        },
        [releasePreviewUrl]
    );

    // ── Validation ───────────────────────────────────────────────────────────

    const validate = useCallback(
        (): string | null => {
            if (!formValues.tag.trim()) {
                return "Eyebrow tag is required.";
            }

            if (!formValues.headlineTop.trim()) {
                return "Headline line 1 is required.";
            }

            if (!formValues.headlineBottom.trim()) {
                return "Headline line 2 is required.";
            }

            if (!formValues.body.trim()) {
                return "Body copy is required.";
            }

            if (!editingId && !imageFile) {
                return "Please upload a banner image.";
            }

            if (
                Number.isNaN(
                    Number(formValues.displayOrder)
                ) ||
                Number(formValues.displayOrder) < 0
            ) {
                return "Display order must be a non-negative number.";
            }

            return null;
        },
        [
            formValues,
            editingId,
            imageFile,
        ]
    );

    // ── Save ─────────────────────────────────────────────────────────────────

    const save = useCallback(async () => {
        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError("");

        try {
            let {
                imageUrl,
                imagePublicId,
            } = formValues;

            // Upload new image first.
            if (imageFile) {
                const uploaded =
                    await uploadBannerImage(imageFile);

                imageUrl = uploaded.url;
                imagePublicId = uploaded.publicId;
            }

            const payload = {
                ...formValues,
                imageUrl,
                imagePublicId,
                displayOrder: Number(
                    formValues.displayOrder
                ),
            };

            if (editingId) {
                await updateBanner(
                    editingId,
                    payload
                );
            } else {
                await createBanner(payload);
            }

            await load();
            closeForm();
        } catch (e: unknown) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Save failed. Please try again."
            );
        } finally {
            setSaving(false);
        }
    }, [
        validate,
        formValues,
        imageFile,
        editingId,
        load,
        closeForm,
    ]);

    // ── Delete ────────────────────────────────────────────────────────────────

    const remove = useCallback(
        async (id: number) => {
            setError("");

            const previous = banners;

            // Optimistic update.
            setBanners((prev) =>
                prev.filter(
                    (b) => b.id !== id
                )
            );

            try {
                await deleteBanner(id);

                if (editingId === id) {
                    closeForm();
                }
            } catch (e: unknown) {
                setBanners(previous);

                setError(
                    e instanceof Error
                        ? e.message
                        : "Delete failed."
                );
            }
        },
        [
            banners,
            editingId,
            closeForm,
        ]
    );

    // ── Toggle active ────────────────────────────────────────────────────────

    const toggle = useCallback(
        async (id: number) => {
            setError("");

            const previous = banners;

            // Optimistic update.
            setBanners((prev) =>
                prev.map((b) =>
                    b.id === id
                        ? {
                            ...b,
                            active: !b.active,
                        }
                        : b
                )
            );

            try {
                const updated =
                    await toggleBannerActive(id);

                setBanners((prev) =>
                    prev.map((b) =>
                        b.id === id
                            ? updated
                            : b
                    )
                );
            } catch (e: unknown) {
                setBanners(previous);

                setError(
                    e instanceof Error
                        ? e.message
                        : "Toggle failed."
                );
            }
        },
        [banners]
    );

    // ── Drag start ───────────────────────────────────────────────────────────

    const onDragStart = useCallback(
        (index: number) => {
            preDragOrderRef.current = banners;
            setDraggingIndex(index);
        },
        [banners]
    );

    // ── Drag over ────────────────────────────────────────────────────────────

    const onDragOver = useCallback(
        (
            e: React.DragEvent,
            targetIndex: number
        ) => {
            e.preventDefault();

            if (
                draggingIndex === null ||
                draggingIndex === targetIndex
            ) {
                return;
            }

            setBanners((prev) => {
                const next = [...prev];

                const [moved] =
                    next.splice(
                        draggingIndex,
                        1
                    );

                next.splice(
                    targetIndex,
                    0,
                    moved
                );

                return next;
            });

            setDraggingIndex(targetIndex);
        },
        [draggingIndex]
    );

    // ── Drop ─────────────────────────────────────────────────────────────────

    const onDrop = useCallback(
        async () => {
            if (draggingIndex === null) {
                return;
            }

            setDraggingIndex(null);

            try {
                await reorderBanners(
                    banners.map(
                        (b) => b.id
                    )
                );

                preDragOrderRef.current = null;
            } catch (e: unknown) {
                setError(
                    e instanceof Error
                        ? e.message
                        : "Reorder failed."
                );

                if (
                    preDragOrderRef.current
                ) {
                    setBanners(
                        preDragOrderRef.current
                    );
                }

                preDragOrderRef.current = null;
            }
        },
        [
            draggingIndex,
            banners,
        ]
    );

    // ── Drag end ─────────────────────────────────────────────────────────────

    const onDragEnd = useCallback(
        () => {
            setDraggingIndex(null);
        },
        []
    );

    // ── Return API ───────────────────────────────────────────────────────────

    return {
        banners,
        loading,
        error,

        formValues,
        editingId,
        saving,
        formOpen,
        imagePreview,

        draggingIndex,

        load,
        openCreateForm,
        openEditForm,
        closeForm,
        updateField,

        handleImageSelected,
        save,
        remove,
        toggle,

        onDragStart,
        onDragOver,
        onDrop,
        onDragEnd,
    };
}