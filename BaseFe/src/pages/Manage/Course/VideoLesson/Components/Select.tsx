import React, { useEffect, useState, useMemo } from 'react';
import { Select, message } from 'antd';
import { useModel } from 'umi';

interface VideoLessonSelectProps {
	value?: string | number;
	onChange?: (val: string | number) => void;
	placeholder?: string;
	disabled?: boolean;
	allowClear?: boolean;
	style?: React.CSSProperties;
	size?: 'small' | 'middle' | 'large';
	defaultFirst?: boolean;
}

const VideoLessonSelect: React.FC<VideoLessonSelectProps> = ({
	value,
	onChange,
	placeholder = 'Chọn video bài học',
	disabled = false,
	allowClear = true,
	style = { width: '100%' },
	size = 'middle',
	defaultFirst = false,
}) => {
	const { danhSach, getAllModel } = useModel('course.videoLesson');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchVideoLessons = async () => {
			try {
				setLoading(true);
				const res = await getAllModel();
				if (defaultFirst && onChange && res?.length > 0 && !value) {
					onChange(res[0].id);
				}
			} catch (error) {
				message.error('Không thể tải danh sách video bài học');
			} finally {
				setLoading(false);
			}
		};

		fetchVideoLessons();
	}, []);

	const options = useMemo(() => {
		return danhSach.map((videoLesson: VideoLesson.IRecord) => {
			const label = `Video #${videoLesson.id} - Bài học #${videoLesson.lesson_id}`;
			return {
				value: videoLesson.id,
				label: label,
				searchText: `${videoLesson.video_url} ${videoLesson.transcript || ''}`.toLowerCase(),
			};
		});
	}, [danhSach]);

	return (
		<Select
			value={value}
			onChange={onChange}
			options={options}
			showSearch
			optionFilterProp='label'
			placeholder={placeholder}
			style={style}
			size={size}
			disabled={disabled}
			allowClear={allowClear}
			loading={loading}
			filterOption={(input, option) => {
				const searchInput = input.toLowerCase();
				return (
					((option?.label as string)?.toLowerCase().includes(searchInput) ||
						(option as any)?.searchText?.includes(searchInput)) ??
					false
				);
			}}
			notFoundContent={loading ? 'Đang tải...' : 'Không tìm thấy video bài học nào'}
		/>
	);
};

export default VideoLessonSelect;
