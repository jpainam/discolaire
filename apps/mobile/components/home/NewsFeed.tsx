import { ChevronRight } from "lucide-react-native";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock news data - in a real app, this would come from an API
const newsItems = [
  {
    id: "1",
    title: "Annual Science Fair Next Month",
    content:
      "Prepare your projects for the upcoming science fair. Registration opens next week.",
    date: "2 hours ago",
    imageUrl:
      "https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Event",
  },
  {
    id: "2",
    title: "Basketball Team Wins State Championship",
    content:
      "Our school basketball team secured the state championship title for the third consecutive year.",
    date: "1 day ago",
    imageUrl:
      "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Sports",
  },
  {
    id: "3",
    title: "New Library Resources Available",
    content:
      "The school library has added new digital resources for research and study materials.",
    date: "3 days ago",
    imageUrl:
      "https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600",
    category: "Academics",
  },
];

export default function NewsFeed() {
  const renderNewsItem = ({
    item,
  }: {
    item: {
      imageUrl: string;
      category: string;
      title: string;
      content: string;
      date: string;
    };
  }) => (
    <TouchableOpacity style={styles.newsItem} activeOpacity={0.8}>
      <Image source={{ uri: item.imageUrl }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsExcerpt} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.newsDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>School News</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={16} color="#4361ee" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={newsItems}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4361ee",
    marginRight: 4,
  },
  newsItem: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 16,
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#4361ee15",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    color: "#4361ee",
    fontWeight: "600",
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  newsExcerpt: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    lineHeight: 18,
  },
  newsDate: {
    fontSize: 11,
    color: "#94a3b8",
  },
});
