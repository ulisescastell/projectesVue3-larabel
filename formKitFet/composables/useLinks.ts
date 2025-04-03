import { RawLink } from "~~/types"
import { Link } from "~~/types"
import { Ref } from "vue"
import { PaginatedResponse } from "~~/types"
import { ref } from "vue";
import axios from "axios";

interface UseLinksOptions {
    queries?: Ref<Record<string, string | number>>
}

function adapter(link: RawLink): Link {
    return {
        ...link,
        created_at: new Date(link.created_at),
        updated_at: new Date(link.updated_at)
    }
}

export const useLinks = ({ queries = ref({})}: UseLinksOptions = {}) => {
    const slug = "links";
    const paginatedData = ref<PaginatedResponse<Link>>();
    const item = ref<Link>({
        id: 0,
        short_link: "",
        full_link: "",
        views: 0,
        created_at: new Date(),
        updated_at: new Date()
    });

    async function index(qs?: Record<string, string | number>) {
        qs = { ...queries.value, ...qs };
        // @ts-expect-error
        const q = new URLSearchParams(qs).toString();
        const { data } = await axios.get<PaginatedResponse<RawLink>>(
            `/${slug}?${q}`
        );
        return (paginatedData.value = {
            ...data,
            data: data.data.map((i) => adapter(i)),
        })
    }

    async function find(id: string | number) {
        const { data } = await axios.get<RawLink>(`/${slug}/${id}`);
        return (item.value = adapter(data));
    }

    async function create(payload: Partial<Link>) {
        const { data } = await axios.post<RawLink>(`/${slug}`, payload);
        return (item.value = adapter(data));
    }

    async function update(id: string | number, payload: Partial<Link>) {
        const { data } = await axios.put<RawLink>(`/${slug}/${id}`, payload);
        return (item.value = adapter(data));
    }

    async function destroy(id: string | number) {
        await axios.delete(`/${slug}/${id}`);
    }

    return {
        data: paginatedData,
        link: item,
        index,
        find,
        create,
        update,
        destroy
    }
}